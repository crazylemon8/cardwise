/**
 * Cards Data
 * Credit card data for the application
 */

import type { CardReadable } from '../types';
import { AXIS_ATLAS_READABLE, AXIS_MAGNUS_READABLE } from './axis';

export const cardsData: CardReadable[] = [
  AXIS_ATLAS_READABLE,
  AXIS_MAGNUS_READABLE,
];
