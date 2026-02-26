import { LedgerEntryType } from "@/app/generated/prisma/client";

export type TransferParams = {
  from: { ownerType: any; ownerId: string };
  to: { ownerType: any; ownerId: string };
  amount: number;
  currency: string;
  reference: string;
  type: LedgerEntryType;
};
