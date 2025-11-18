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
        const cardsWithZeroRewards = cardsData.map(card => ({
          card,
          estimatedRewards: 0,
          annualFee: card.annual_fee,
          netValue: card.welcome_net - card.annual_fee,
          welcomeBenefit: card.welcome_net,
        }));
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
          score: rewardsData.netValue,
        };
      });

      // Sort by score (highest first)
      cardsWithScores.sort((a, b) => b.score - a.score);

      // Return top 5 cards with their reward details
      const top5 = cardsWithScores.slice(0, 5).map(({ card, estimatedRewards, annualFee, netValue, welcomeBenefit }) => ({
        card,
        estimatedRewards,
        annualFee,
        netValue,
        welcomeBenefit,
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
 * @returns Object containing rewards breakdown and net value
 */
function calculateCardValue(card: CardReadable, filters: RecommendationFilters): {
  totalRewards: number;
  netValue: number;
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

  // Calculate net value: rewards - annual fee + welcome benefit (amortized)
  // Welcome benefit is typically one-time, so we can consider it as first-year benefit
  const netValue = totalRewards - card.annual_fee + (card.welcome_net / 1); // Divide by years to amortize

  return {
    totalRewards,
    netValue,
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
};

export type CardsRouter = typeof cardsRouter;
