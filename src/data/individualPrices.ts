export const INDIVIDUAL_PRICES = { single: 75, sessions: 3, package: 203 } as const;
export const ORIGINAL_PACKAGE_PRICE = INDIVIDUAL_PRICES.single * INDIVIDUAL_PRICES.sessions;
export const PACKAGE_SAVINGS = ORIGINAL_PACKAGE_PRICE - INDIVIDUAL_PRICES.package;
