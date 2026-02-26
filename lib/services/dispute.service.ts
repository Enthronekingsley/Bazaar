import prisma from "@/lib/prisma";
import {
  EscrowStatus,
  DisputeResolution,
  AccountType,
  LedgerEntryType,
} from "@/app/generated/prisma/client";
import { ledgerService } from "./ledger-entry.service";

export class DisputeService {
  async openDispute(escrowId: string, reason: string) {
    await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrowAccount.findUnique({
        where: { id: escrowId },
      });

      if (!escrow) throw new Error("Escrow not found");
      if (escrow.status !== EscrowStatus.HOLDING) return;

      await tx.escrowAccount.update({
        where: { id: escrow.id },
        data: { status: EscrowStatus.DISPUTED },
      });

      await tx.dispute.create({
        data: {
          escrowId,
          reason,
          evidence: {},
        },
      });
    });
  }

  async resolveDispute(disputeId: string, resolution: DisputeResolution) {
    await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.findUnique({
        where: { id: disputeId },
        include: {
          escrow: { include: { paymentIntent: true } },
        },
      });

      if (!dispute || !dispute.escrow) throw new Error("Invalid dispute");

      const escrow = dispute.escrow;

      if (escrow.status !== EscrowStatus.DISPUTED) return;

      const recipient =
        resolution === DisputeResolution.BUYER
          ? {
              ownerType: AccountType.BUYER,
              ownerId: escrow.paymentIntent.buyerId,
            }
          : {
              ownerType: AccountType.SELLER,
              ownerId: escrow.paymentIntent.sellerId,
            };

      await tx.escrowAccount.update({
        where: { id: escrow.id },
        data: {
          status: EscrowStatus.RELEASED,
          releasedAt: new Date(),
        },
      });

      await ledgerService.transfer(tx, {
        from: { ownerType: AccountType.ESCROW, ownerId: escrow.id },
        to: recipient,
        amount: escrow.amountLocked,
        currency: escrow.currency,
        reference: dispute.id,
        type: LedgerEntryType.DISPUTE,
      });

      await tx.dispute.update({
        where: { id: dispute.id },
        data: {
          resolvedAt: new Date(),
          resolution,
        },
      });
    });
  }
}

export const disputeService = new DisputeService();
