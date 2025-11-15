/**
 * Cards Data
 * Sample credit card data for the application
 */

import type { Card } from '../types';

export const cardsData: Card[] = [
  {
    id: '1',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    category: 'Travel',
    annualFee: 95,
    rewardsRate: 2.0,
    minCreditScore: 690,
    signUpBonus: 60000,
    benefits: [
      '2X points on travel and dining',
      '25% more value when redeemed for travel',
      'No foreign transaction fees',
    ],
  },
  {
    id: '2',
    name: 'American Express Gold',
    issuer: 'American Express',
    category: 'Dining',
    annualFee: 250,
    rewardsRate: 4.0,
    minCreditScore: 700,
    signUpBonus: 90000,
    benefits: [
      '4X points at restaurants',
      '4X points at U.S. supermarkets',
      '$120 dining credit annually',
    ],
  },
  {
    id: '3',
    name: 'Citi Double Cash',
    issuer: 'Citi',
    category: 'Cash Back',
    annualFee: 0,
    rewardsRate: 2.0,
    minCreditScore: 670,
    benefits: [
      '2% cash back on all purchases',
      'No annual fee',
      '0% intro APR for 18 months',
    ],
  },
  {
    id: '4',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    category: 'Travel',
    annualFee: 395,
    rewardsRate: 2.0,
    minCreditScore: 720,
    signUpBonus: 75000,
    benefits: [
      '2X miles on all purchases',
      '$300 annual travel credit',
      'Priority Pass lounge access',
    ],
  },
  {
    id: '5',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    category: 'Cash Back',
    annualFee: 0,
    rewardsRate: 5.0,
    minCreditScore: 650,
    benefits: [
      '5% cash back on rotating categories',
      '1% cash back on all other purchases',
      'Cashback Match for first year',
    ],
  },
];
