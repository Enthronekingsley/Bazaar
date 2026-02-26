export const BAZAAR_PLATFORM_FEE_PERCENT = 0.05;

export function calculateBazaarFees(amountTotal: number) {
  const platformFee = Math.round(amountTotal * BAZAAR_PLATFORM_FEE_PERCENT);
  const sellerAmount = amountTotal - platformFee;

  return {
    platformFee,
    sellerAmount,
    escrowAmount: amountTotal,
  };
}
