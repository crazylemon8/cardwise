/**
 * Cards API Routes
 * Handles all card-related API endpoints
 */

import { cardsData } from '../cards/cards.data';
import type { Card, ApiResponse } from '../types';

/**
 * Cards Router
 * Defines all routes for card operations
 */
export const cardsRouter = {
  /**
   * GET /api/cards/recommendations
   * Get card recommendations
   * TODO: Add filtering logic based on user preferences
   */
  getRecommendations: async (): Promise<ApiResponse<Card[]>> => {
    try {
      // Return random top 5 cards for now
      const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
      const top5 = shuffled.slice(0, 5);

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

export type CardsRouter = typeof cardsRouter;
