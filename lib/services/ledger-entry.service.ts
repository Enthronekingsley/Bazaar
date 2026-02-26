import {
  Prisma,
  LedgerDirection,
  LedgerMovementCategory,
} from "@/app/generated/prisma/client";
import { TransferParams } from "./type.service";
import { ledgerAccountService } from "./ledger-account.service";

export class LedgerService {
  async post(
    tx: Prisma.TransactionClient,
    {
      ownerType,
      ownerId,
      currency,
      amount,
      direction,
      type,
      reference,
    }: {
      ownerType: any;
      ownerId: string;
      currency: string;
      amount: number;
      direction: LedgerDirection;
      type: LedgerMovementCategory;
      reference: string;
    },
  ) {
    const account = await ledgerAccountService.getOrCreateAccount(
      tx,
      ownerType,
      ownerId,
      currency,
    );

    await tx.ledgerEntry.create({
      data: {
        accountId: account.id,
        type,
        direction,
        amount,
        currency,
        reference,
      },
    });
  }

  async transfer(
    tx: Prisma.TransactionClient,
    { from, to, amount, currency, reference, type }: TransferParams,
  ) {
    await this.post(tx, {
      ...from,
      amount,
      currency,
      direction: LedgerDirection.OUT,
      type,
      reference,
    });

    await this.post(tx, {
      ...to,
      amount,
      currency,
      direction: LedgerDirection.IN,
      type,
      reference,
    });
  }
}

export const ledgerService = new LedgerService();
