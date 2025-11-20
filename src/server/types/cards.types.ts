/**
 * Card Data Types for Readable Card Definitions
 */

/**
 * Category-based rate/cap structure
 * Keys correspond to spending categories
 */
export interface CategoryRates {
  groceries: number;
  dining: number;
  fuel: number;
  online: number;
  utilities: number;
  travel_dom: number;
  travel_intl: number;
  rent_education: number;
  other: number;
}

/**
 * Renewal benefit configuration
 * Defines fee waivers or benefits at card renewal
 */
export interface RenewalBenefit {
  /** Type of renewal benefit */
  type: 'fee_waiver' | 'voucher' | 'points' | 'none';
  
  /** Whether the annual fee is waived (for fee_waiver type) */
  fee_waiver?: boolean;
  
  /** Number of reward points/miles awarded at renewal (for points type) */
  points?: number;
  
  /** Value of renewal benefit in INR (for vouchers/points, optional for fee_waiver) */
  value_in_inr?: number;
  
  /** Conditions required to receive the benefit */
  condition?: {
    /** Minimum annual spend threshold required */
    annual_spend_threshold?: number;
  };
  
  /** Whether the benefit applies in the first year */
  applies_first_year: boolean;
  
  /** Additional notes about the renewal benefit */
  notes?: string;
}

/**
 * Readable card definition containing all card details,
 * reward rates, caps, and metadata
 */
export interface CardReadable {
  /** Unique identifier for the card */
  id: string;
  
  /** Bank or financial institution issuing the card */
  issuer: string;
  
  /** Full name of the credit card */
  name: string;
  
  /** Annual fee in INR */
  annual_fee: number;
  
  /** Net welcome benefit value in INR */
  welcome_net: number;
  
  /** Foreign exchange markup percentage */
  fx_markup_pct: number;
  
  /** Bitfield for card flags/features */
  flags: number;
  
  /** Date when card details were last verified (YYYY-MM-DD) */
  verified_at: string;
  
  /** Effective reward rates per category (value per INR spent) */
  eff_rates: CategoryRates;
  
  /** Annual spending caps per category in INR (0 = no cap) */
  caps: CategoryRates;
  
  /** Fallback rates applied after category cap is exceeded */
  post_cap_rates: CategoryRates;
  
  /** List of excluded transaction types */
  exclusions?: string[];
  
  /** Renewal benefit configuration */
  renewal?: RenewalBenefit;
  
  /** Additional notes or assumptions about the card */
  notes?: string;
}
