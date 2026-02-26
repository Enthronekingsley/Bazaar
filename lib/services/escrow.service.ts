import prisma from "@/lib/prisma";
import {
  EscrowStatus,
  EscrowReleaseReason,
  AccountType,
  LedgerEntryType,
  DealStatus,
} from "@/app/generated/prisma/client";
import { ledgerService } from "./ledger-entry.service";

export class EscrowService {
  async releaseEscrow(escrowId: string, reason: EscrowReleaseReason) {
    await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrowAccount.findUnique({
        where: { id: escrowId },
        include: {
          paymentIntent: true,
          deals: true,
        },
      });

      if (!escrow) throw new Error("Escrow not found");
      if (escrow.status !== EscrowStatus.HOLDING) return;

      await tx.escrowAccount.update({
        where: { id: escrow.id },
        data: {
          status: EscrowStatus.RELEASED,
          releasedAt: new Date(),
          releaseReason: reason,
        },
      });

      await ledgerService.transfer(tx, {
        from: { ownerType: AccountType.ESCROW, ownerId: escrow.id },
        to: {
          ownerType: AccountType.SELLER,
          ownerId: escrow.paymentIntent.sellerId,
        },
        amount: escrow.amountLocked,
        currency: escrow.currency,
        reference: escrow.id,
        type: LedgerEntryType.CREDIT,
      });

      for (const deal of escrow.deals) {
        if (deal.status !== DealStatus.IN_ESCROW) continue;

        await tx.deal.update({
          where: { id: deal.id },
          data: {
            status: DealStatus.COMPLETED,
            completedAt: new Date(),
          },
        });
      }
    });
  }
}

export const escrowService = new EscrowService();
