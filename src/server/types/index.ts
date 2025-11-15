/**
 * Card Type Definitions
 */

export interface Card {
  id: string;
  name: string;
  issuer: string;
  category: string;
  annualFee: number;
  rewardsRate: number;
  minCreditScore: number;
  signUpBonus?: number;
  benefits: string[];
  imageUrl?: string;
}

export interface CardFilters {
  creditScore?: number;
  category?: string;
  annualFee?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
