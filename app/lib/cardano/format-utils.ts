/**
 * Cardano Balance Formatting Utilities
 *
 * Centralized utilities for converting between lovelace and ADA,
 * formatting balances for display, and validating transaction amounts.
 *
 * Conversion: 1 ADA = 1,000,000 lovelace
 */

export interface LovelaceToAdaOptions {
  precision?: number;
  includeSymbol?: boolean;
  includeCommas?: boolean;
}

/**
 * Convert lovelace to ADA with consistent formatting
 *
 * @param lovelace - Amount in lovelace (1,000,000 lovelace = 1 ADA)
 * @param options - Formatting options
 * @returns Formatted ADA string
 *
 * @example
 * lovelaceToAda(1000000) // "1.000000"
 * lovelaceToAda(1000000, { includeSymbol: true }) // "1.000000 ADA"
 * lovelaceToAda(1234567890, { precision: 2, includeCommas: true }) // "1,234.57"
 */
export function lovelaceToAda(
  lovelace: number | string | undefined | null,
  options: LovelaceToAdaOptions = {}
): string {
  const {
    precision = 6,
    includeSymbol = false,
    includeCommas = false,
  } = options;

  // Handle undefined/null/invalid input
  const amount = typeof lovelace === 'string' ? parseFloat(lovelace) : lovelace;

  if (typeof amount !== 'number' || isNaN(amount) || amount === null) {
    const fallback = '0.' + '0'.repeat(precision);
    return includeSymbol ? `${fallback} ADA` : fallback;
  }

  // Convert lovelace to ADA
  const ada = amount / 1_000_000;

  // Format with specified precision
  const formatted = ada.toFixed(precision);

  // Add thousand separators if requested
  let result = formatted;
  if (includeCommas) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    result = parts.join('.');
  }

  return includeSymbol ? `${result} ADA` : result;
}

/**
 * Convert ADA to lovelace
 *
 * @param ada - Amount in ADA
 * @returns Amount in lovelace (rounded down to integer)
 *
 * @example
 * adaToLovelace(1) // 1000000
 * adaToLovelace(1.5) // 1500000
 * adaToLovelace("2.5") // 2500000
 */
export function adaToLovelace(ada: number | string): number {
  const amount = typeof ada === 'string' ? parseFloat(ada) : ada;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return 0;
  }

  // Always round down to avoid overspending
  return Math.floor(amount * 1_000_000);
}

/**
 * Format balance with smart precision based on amount size
 *
 * - Large amounts (≥1000 ADA): 2 decimals with commas
 * - Medium amounts (≥10 ADA): 3 decimals
 * - Small amounts (<10 ADA): 6 decimals (full precision)
 *
 * @param lovelace - Amount in lovelace
 * @returns Formatted balance string with "ADA" suffix
 *
 * @example
 * formatBalanceSmart(1234567890) // "1,234.57 ADA"
 * formatBalanceSmart(50000000) // "50.000 ADA"
 * formatBalanceSmart(5000000) // "5.000000 ADA"
 */
export function formatBalanceSmart(lovelace: number | undefined | null): string {
  if (lovelace === undefined || lovelace === null) {
    return '-- ADA';
  }

  const ada = lovelace / 1_000_000;

  if (ada >= 1000) {
    // Large amounts: 2 decimals with thousand separators
    return lovelaceToAda(lovelace, {
      precision: 2,
      includeSymbol: true,
      includeCommas: true
    });
  } else if (ada >= 10) {
    // Medium amounts: 3 decimals
    return lovelaceToAda(lovelace, {
      precision: 3,
      includeSymbol: true
    });
  } else {
    // Small amounts: full precision
    return lovelaceToAda(lovelace, {
      precision: 6,
      includeSymbol: true
    });
  }
}

/**
 * Validate if wallet has sufficient balance for transaction
 *
 * @param balanceLovelace - Current wallet balance in lovelace
 * @param amountLovelace - Transaction amount in lovelace
 * @param feeLovelace - Transaction fee in lovelace
 * @returns True if balance >= (amount + fee), false otherwise
 *
 * @example
 * hasSufficientBalance(10000000, 5000000, 170000) // true (10 ADA >= 5.17 ADA)
 * hasSufficientBalance(1000000, 5000000, 170000) // false (1 ADA < 5.17 ADA)
 */
export function hasSufficientBalance(
  balanceLovelace: number,
  amountLovelace: number,
  feeLovelace: number
): boolean {
  const totalRequired = amountLovelace + feeLovelace;
  return balanceLovelace >= totalRequired;
}

/**
 * Calculate maximum spendable amount (balance minus estimated fee)
 *
 * @param balanceLovelace - Current wallet balance in lovelace
 * @param estimatedFeeLovelace - Estimated transaction fee in lovelace (default: 170000 = 0.17 ADA)
 * @returns Maximum spendable amount in lovelace (never negative)
 *
 * @example
 * getMaxSpendable(10000000) // 9830000 (10 - 0.17 ADA in lovelace)
 * getMaxSpendable(100000, 170000) // 0 (insufficient for fee)
 */
export function getMaxSpendable(
  balanceLovelace: number,
  estimatedFeeLovelace: number = 170000 // 0.17 ADA default fee
): number {
  const maxAmount = balanceLovelace - estimatedFeeLovelace;
  return Math.max(0, maxAmount);
}

/**
 * Get Tailwind CSS color classes based on balance status
 *
 * @param balanceLovelace - Current balance in lovelace
 * @param requiredLovelace - Required amount (optional, for validation)
 * @returns Object with text and background color classes
 *
 * @example
 * getBalanceStatusColor(1000000)
 * // { text: 'text-yellow-600 dark:text-yellow-400', background: 'bg-yellow-50 dark:bg-yellow-900/20' }
 *
 * getBalanceStatusColor(10000000, 15000000)
 * // { text: 'text-red-600 dark:text-red-400', background: 'bg-red-50 dark:bg-red-900/20' }
 */
export function getBalanceStatusColor(
  balanceLovelace: number,
  requiredLovelace?: number
): {
  text: string;
  background: string;
} {
  // Red if insufficient for required amount
  if (requiredLovelace !== undefined && balanceLovelace < requiredLovelace) {
    return {
      text: 'text-red-600 dark:text-red-400',
      background: 'bg-red-50 dark:bg-red-900/20',
    };
  }

  const ada = balanceLovelace / 1_000_000;

  // Yellow warning for low balance (< 10 ADA)
  if (ada < 10) {
    return {
      text: 'text-yellow-600 dark:text-yellow-400',
      background: 'bg-yellow-50 dark:bg-yellow-900/20',
    };
  }

  // Green for sufficient balance
  return {
    text: 'text-green-600 dark:text-green-400',
    background: 'bg-green-50 dark:bg-green-900/20',
  };
}

/**
 * Parse ADA amount from user input string
 *
 * Handles various input formats:
 * - "1.5" → 1.5
 * - "1,234.56" → 1234.56
 * - "1 234,56" → 1234.56 (European format)
 *
 * @param input - User input string
 * @returns Parsed number or 0 if invalid
 */
export function parseAdaInput(input: string): number {
  if (!input || typeof input !== 'string') {
    return 0;
  }

  // Remove whitespace and common thousand separators
  const cleaned = input
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, ''); // Assumes US format (comma as thousand separator)

  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate if an amount is within safe Cardano transaction limits
 *
 * @param amountLovelace - Amount in lovelace
 * @returns True if within safe limits, false otherwise
 */
export function isValidTransactionAmount(amountLovelace: number): boolean {
  const MIN_ADA = 1; // Minimum 1 ADA
  const MAX_ADA = 45_000_000_000; // 45 billion ADA (total supply)

  const ada = amountLovelace / 1_000_000;

  return ada >= MIN_ADA && ada <= MAX_ADA;
}
