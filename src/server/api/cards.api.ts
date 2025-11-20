/**
 * Cards API Routes
 * Handles all card-related API endpoints
 */

import { cardsData } from '../cards/cards.data';
import type { CardReadable, ApiResponse, CardWithRewards } from '../types';

interface RecommendationFilters {
  annualSpend?: number;
  groceries?: number;
  dining?: number;
  travel?: number;
  others?: number;
}

/**
 * Cards Router
 * Defines all routes for card operations
 */
export const cardsRouter = {
  /**
   * GET /api/cards/recommendations
   * Get card recommendations based on user filters
   */
  getRecommendations: async (filters?: RecommendationFilters): Promise<ApiResponse<CardWithRewards[]>> => {
    try {
      console.log('Filters received:', filters);
      
      // If no filters provided, return all cards with zero rewards
      if (!filters || !filters.annualSpend) {
        const cardsWithZeroRewards = cardsData.map(card => {
          // Calculate renewal benefit even with zero spend
          const renewalBenefitValue = calculateRenewalBenefit(card, 0);
          return {
            card,
            estimatedRewards: 0,
            annualFee: card.annual_fee,
            netValue: card.welcome_net - card.annual_fee,
            welcomeBenefit: card.welcome_net,
            subsequentYearValue: 0 - card.annual_fee + renewalBenefitValue,
          };
        });
        return {
          success: true,
          data: cardsWithZeroRewards,
        };
      }

      // Calculate value score for each card based on user's spending pattern
      const cardsWithScores = cardsData.map(card => {
        const rewardsData = calculateCardValue(card, filters);
        return {
          card,
          estimatedRewards: rewardsData.totalRewards,
          annualFee: card.annual_fee,
          netValue: rewardsData.netValue,
          welcomeBenefit: card.welcome_net,
          subsequentYearValue: rewardsData.subsequentYearValue,
          score: rewardsData.netValue,
        };
      });

      // Sort by subsequentYearValue first (highest first), then by netValue as tiebreaker
      cardsWithScores.sort((a, b) => {
        const subsequentDiff = b.subsequentYearValue - a.subsequentYearValue;
        if (subsequentDiff !== 0) {
          return subsequentDiff;
        }
        // If subsequentYearValue is equal, sort by netValue (first year)
        return b.netValue - a.netValue;
      });

      // Return top 5 cards with their reward details
      const top5 = cardsWithScores.slice(0, 5).map(({ card, estimatedRewards, annualFee, netValue, welcomeBenefit, subsequentYearValue }) => ({
        card,
        estimatedRewards,
        annualFee,
        netValue,
        welcomeBenefit,
        subsequentYearValue,
      }));

      return {
        success: true,
        data: top5,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch recommendations',
      };
    }
  },
};

/**
 * Calculate the net value (rewards - costs) for a card based on user spending
 * @param card - The card to evaluate
 * @param filters - User's spending patterns
 * @returns Object containing rewards breakdown, net value, and subsequent year value
 */
function calculateCardValue(card: CardReadable, filters: RecommendationFilters): {
  totalRewards: number;
  netValue: number;
  subsequentYearValue: number;
} {
  const {
    groceries = 0,
    dining = 0,
    travel = 0,
    others = 0,
  } = filters;

  let totalRewards = 0;

  // Calculate rewards for groceries
  totalRewards += calculateCategoryRewards(
    groceries,
    card.eff_rates.groceries,
    card.caps.groceries,
    card.post_cap_rates.groceries
  );

  // Calculate rewards for dining
  totalRewards += calculateCategoryRewards(
    dining,
    card.eff_rates.dining,
    card.caps.dining,
    card.post_cap_rates.dining
  );

  // Calculate rewards for travel (combining domestic and international)
  // Assuming user doesn't specify split, use travel_dom rates
  totalRewards += calculateCategoryRewards(
    travel,
    card.eff_rates.travel_dom,
    card.caps.travel_dom,
    card.post_cap_rates.travel_dom
  );

  // Calculate rewards for other spending
  totalRewards += calculateCategoryRewards(
    others,
    card.eff_rates.other,
    card.caps.other,
    card.post_cap_rates.other
  );

  // Calculate total annual spend for renewal benefit calculations
  const totalAnnualSpend = groceries + dining + travel + others;

  // Calculate renewal benefit value
  const renewalBenefitValue = calculateRenewalBenefit(card, totalAnnualSpend);

  // Calculate net value: rewards - annual fee + welcome benefit (first year)
  const netValue = totalRewards - card.annual_fee + card.welcome_net;

  // Calculate subsequent year value: rewards - annual fee + renewal benefit
  const subsequentYearValue = totalRewards - card.annual_fee + renewalBenefitValue;

  return {
    totalRewards,
    netValue,
    subsequentYearValue,
  };
}

/**
 * Calculate rewards for a specific category considering caps
 * @param spending - Annual spending in this category (INR)
 * @param baseRate - Base reward rate (value per INR spent)
 * @param cap - Annual spending cap for this rate (0 = no cap)
 * @param postCapRate - Rate applied after cap is reached
 * @returns Total rewards value in INR
 */
function calculateCategoryRewards(
  spending: number,
  baseRate: number,
  cap: number,
  postCapRate: number
): number {
  if (spending <= 0) return 0;

  // If no cap or spending is within cap
  if (cap === 0 || spending <= cap) {
    return spending * baseRate;
  }

  // Spending exceeds cap: calculate rewards in two parts
  const rewardsUpToCap = cap * baseRate;
  const rewardsAfterCap = (spending - cap) * postCapRate;
  
  return rewardsUpToCap + rewardsAfterCap;
}

/**
 * Calculate the value of renewal benefits for subsequent years
 * @param card - The card to evaluate
 * @param totalAnnualSpend - Total annual spending across all categories
 * @returns Renewal benefit value in INR
 */
function calculateRenewalBenefit(card: CardReadable, totalAnnualSpend: number): number {
  // If no renewal benefit is defined, return 0
  if (!card.renewal) {
    return 0;
  }

  const renewal = card.renewal;

  // Check if benefit applies (some benefits may not apply in first year, but we're calculating for year 2+)
  // For subsequent years calculation, we assume the benefit applies

  // Handle fee waiver type
  if (renewal.type === 'fee_waiver') {
    // Check if spending threshold is met
    if (renewal.condition?.annual_spend_threshold) {
      if (totalAnnualSpend >= renewal.condition.annual_spend_threshold) {
        // Fee is waived, so the benefit value is the annual fee saved
        return card.annual_fee;
      }
    } else if (renewal.fee_waiver) {
      // Unconditional fee waiver
      return card.annual_fee;
    }
    return 0;
  }

  // Handle points/miles type (e.g., Axis Atlas tiered milestones)
  if (renewal.type === 'points') {
    // For tiered systems like Atlas, determine the tier based on spend
    // Atlas tiers: Silver (default), Gold (>=300k), Platinum (>=750k)
    if (card.id === 'AXIS_ATLAS') {
      if (totalAnnualSpend >= 750000) {
        return 10000; // Platinum milestone: 10,000 miles
      } else if (totalAnnualSpend >= 300000) {
        return 5000; // Gold milestone: 5,000 miles
      } else {
        return 2500; // Silver milestone: 2,500 miles (default)
      }
    }
    
    // For other cards with points renewal, use the value_in_inr if specified
    return renewal.value_in_inr || 0;
  }

  // Handle voucher type
  if (renewal.type === 'voucher') {
    // Check if spending threshold is met
    if (renewal.condition?.annual_spend_threshold) {
      if (totalAnnualSpend >= renewal.condition.annual_spend_threshold) {
        return renewal.value_in_inr || 0;
      }
    } else {
      return renewal.value_in_inr || 0;
    }
    return 0;
  }

  // No renewal benefit
  return 0;
};

export type CardsRouter = typeof cardsRouter;
