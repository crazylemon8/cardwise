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
  
  /** Additional notes or assumptions about the card */
  notes?: string;
}
