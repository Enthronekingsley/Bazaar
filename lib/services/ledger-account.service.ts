import { AccountType, Prisma } from "@/app/generated/prisma/client";

export class LedgerAccountService {
  async getOrCreateAccount(
    tx: Prisma.TransactionClient,
    ownerType: AccountType,
    ownerId: string,
    currency: string,
  ) {
    return tx.ledgerAccount.upsert({
      where: {
        ownerType_ownerId_currency: {
          ownerType,
          ownerId,
          currency,
        },
      },
      update: {},
      create: {
        ownerType,
        ownerId,
        currency,
      },
    });
  }
}

export const ledgerAccountService = new LedgerAccountService();
