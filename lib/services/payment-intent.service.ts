import {
  PaymentIntentStatus,
  EscrowStatus,
  Prisma,
  AccountType,
  LedgerMovementCategory,
} from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { getPaymentGateway } from "../payments/gateway-factory";
import { calculateBazaarFees } from "../payments/fees";
import { CreatePaymentIntentInput, NormalizedWebhookEvent } from "../payments";
import { ledgerService } from "./ledger-entry.service";
import { ESCROW_TIMEOUT_MS } from "@/lib/constants/escrow";

export class PaymentIntentService {
  async createPaymentIntent(input: CreatePaymentIntentInput) {
    const amountInSubunit = input.amount * 100;
    const fees = calculateBazaarFees(amountInSubunit);

    try {
      const gateway = await prisma.paymentGateway.findUniqueOrThrow({
        where: { provider: input.gateway },
      });

      const intent = await prisma.paymentIntent.create({
        data: {
          reference: crypto.randomUUID(),
          idempotencyKey: input.idempotencyKey,

          orderId: input.orderId,
          buyerId: input.buyerId,
          sellerId: input.sellerId,

          gatewayId: gateway.id,
          gatewayProvider: input.gateway,

          amountTotal: input.amount,
          amountInSubunit: amountInSubunit,
          currency: input.currency,

          gatewayFee: 0,
          platformFee: fees.platformFee,
          sellerAmount: fees.sellerAmount,
          escrowAmount: fees.escrowAmount,

          status: PaymentIntentStatus.CREATED,
          escrowStatus: EscrowStatus.HOLDING,

          metadata: {},
        },
      });

      const gatewayClient = getPaymentGateway(input.gateway);
      const result = await gatewayClient.initializePayment({
        reference: intent.reference,
        amount: intent.amountTotal,
        currency: intent.currency,
        email: input.email,
        orderId: intent.orderId,
      });

      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          gatewayReference: result.reference,
          status: PaymentIntentStatus.PROCESSING,
          metadata: { authorizationUrl: result.authorizationUrl },
        },
      });

      return {
        reference: intent.reference,
        authorizationUrl: result.authorizationUrl,
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const existing = await prisma.paymentIntent.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
        });

        if (!existing) throw err;

        return {
          reference: existing.reference,
          authorizationUrl: (existing.metadata as any)?.authorizationUrl,
        };
      }

      throw err;
    }
  }

  async processWebhook(event: NormalizedWebhookEvent) {
    if (event.type === "UNHANDLED_EVENT") return;

    const processed = await prisma.webhookEvent.findUnique({
      where: {
        provider_reference_eventType: {
          provider: event.provider,
          reference: event.gatewayReference,
          eventType: event.type,
        },
      },
    });

    if (processed) return;

    await prisma.$transaction(async (tx) => {
      const webhook = await tx.webhookEvent.create({
        data: {
          provider: event.provider,
          reference: event.gatewayReference,
          eventType: event.type,
          payload: event.payload ?? {},
        },
      });

      const intent = await tx.paymentIntent.findUnique({
        where: { gatewayReference: event.gatewayReference },
      });

      if (!intent) return;
      if (intent.status !== PaymentIntentStatus.PROCESSING) return;

      if (event.type === "PAYMENT_SUCCESS") {
        const gatewayFee = event.gatewayFee ?? 0;
        const sellerAmount =
          intent.amountTotal - intent.platformFee - gatewayFee;

        const now = new Date();
        const releaseAt = new Date(now.getTime() + ESCROW_TIMEOUT_MS);

        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: PaymentIntentStatus.SUCCEEDED,
            paidAt: now,
            escrowLockedAt: now,
            escrowReleaseAt: releaseAt,
            gatewayFee,
            sellerAmount,
          },
        });

        const escrow = await tx.escrowAccount.create({
          data: {
            paymentIntentId: intent.id,
            amountLocked: sellerAmount,
            currency: intent.currency,
            status: EscrowStatus.HOLDING,
            lockedAt: now,
            releaseAt,
          },
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.BUYER,
            ownerId: intent.buyerId,
          },
          to: {
            ownerType: AccountType.PLATFORM,
            ownerId: "GATEWAY",
          },
          amount: intent.amountTotal,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.PAYMENT,
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.PLATFORM,
            ownerId: "GATEWAY",
          },
          to: {
            ownerType: AccountType.PLATFORM,
            ownerId: "GATEWAY_FEE",
          },
          amount: gatewayFee,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.FEE,
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.PLATFORM,
            ownerId: "GATEWAY",
          },
          to: {
            ownerType: AccountType.ESCROW,
            ownerId: escrow.id,
          },
          amount: sellerAmount + intent.platformFee,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.PAYMENT,
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.ESCROW,
            ownerId: escrow.id,
          },
          to: {
            ownerType: AccountType.PLATFORM,
            ownerId: "COMMISSION",
          },
          amount: intent.platformFee,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.RELEASE,
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.ESCROW,
            ownerId: escrow.id,
          },
          to: {
            ownerType: AccountType.SELLER,
            ownerId: intent.sellerId,
          },
          amount: sellerAmount,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.RELEASE,
        });

        await ledgerService.transfer(tx, {
          from: {
            ownerType: AccountType.SELLER,
            ownerId: intent.sellerId,
          },
          to: {
            ownerType: AccountType.PLATFORM,
            ownerId: "BANK",
          },
          amount: sellerAmount,
          currency: intent.currency,
          reference: intent.id,
          type: LedgerMovementCategory.PAYOUT,
        });

        await tx.webhookEvent.update({
          where: { id: webhook.id },
          data: { paymentIntentId: intent.id },
        });
      }

      if (event.type === "PAYMENT_FAILED") {
        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: PaymentIntentStatus.FAILED,
            failureReason: event.reason ?? "gateway_failure",
          },
        });
      }
    });
  }
}

export const paymentIntentService = new PaymentIntentService();
