/*
  Warnings:

  - You are about to drop the `BalanceAccount` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `LedgerEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LedgerMovementCategory" AS ENUM ('PAYMENT', 'RELEASE', 'FEE', 'REFUND', 'PAYOUT', 'DISPUTE');

-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'GATEWAY';

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_accountId_fkey";

-- AlterTable
ALTER TABLE "LedgerEntry" DROP COLUMN "type",
ADD COLUMN     "type" "LedgerMovementCategory" NOT NULL;

-- DropTable
DROP TABLE "BalanceAccount";

-- DropEnum
DROP TYPE "LedgerEntryType";

-- CreateTable
CREATE TABLE "PlatformAccount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "ownerType" "AccountType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformAccount_code_key" ON "PlatformAccount"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_ownerType_ownerId_currency_key" ON "LedgerAccount"("ownerType", "ownerId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_reference_accountId_type_key" ON "LedgerEntry"("reference", "accountId", "type");

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
