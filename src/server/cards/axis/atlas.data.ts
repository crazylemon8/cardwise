import type { CardReadable } from "../../types";

export const AXIS_ATLAS_READABLE: CardReadable = {
  id: "AXIS_ATLAS",
  issuer: "Axis Bank",
  name: "Axis Atlas Credit Card",
  annual_fee: 5000,
  welcome_net: 2500,            // 2500 Edge Miles as joining benefit
  fx_markup_pct: 3.5,
  flags: 0,
  verified_at: "2025-11-17",

  // Reward rates
  eff_rates: {
    groceries: 0.02,          // base earn (2 Miles per ₹100)
    dining: 0.02,
    fuel: 0.00,               // excluded
    online: 0.02,
    utilities: 0.00,          // excluded
    travel_dom: 0.05,         // accelerated (5 Miles per ₹100)
    travel_intl: 0.05,
    rent_education: 0.00,     // excluded
    other: 0.02
  },

  // Caps (annual equivalents)
  caps: {
    groceries: 0,
    dining: 0,
    fuel: 0,
    online: 0,
    utilities: 0,
    travel_dom: 2400000,      // 2L/month × 12
    travel_intl: 2400000,
    rent_education: 0,
    other: 0
  },

  post_cap_rates: {
    groceries: 0.02,
    dining: 0.02,
    fuel: 0.00,
    online: 0.02,
    utilities: 0.00,
    travel_dom: 0.02,         // fallback to base earn
    travel_intl: 0.02,
    rent_education: 0.00,
    other: 0.02
  },

  exclusions: [
    "fuel",
    "utilities",
    "wallet_loads",
    "rent_payments",
    "education_fee",
    "government_payments",
    "insurance_premiums"
  ],

  // --------------------
  // ✔ Renewal block added
  // --------------------
  renewal: {
    type: "points",               // annual milestone Edge Miles
    applies_first_year: false,

    // Atlas tier milestone values (conservative INR valuation)
    // Silver: 2,500
    // Gold: 5,000
    // Platinum: 10,000
    //
    // Condition is spend-based; we will return one of these values
    // depending on total user spend (see notes).

    points: 0,                    // converter/scorer should override based on spend thresholds
    value_in_inr: 0,              // actual resolved value is dynamic; see "notes"

    condition: {
      annual_spend_threshold: 0   // not used directly because thresholds are tiered
    },

    notes: `
Axis Atlas renewal follows a tiered milestone system:
- Silver annual milestone: 2,500 Miles (default)
- Gold milestone (>= ₹3,00,000 annual spend): 5,000 Miles
- Platinum milestone (>= ₹7,50,000 annual spend): 10,000 Miles

Your scoring engine should:
- Detect user's total annual spend.
- Pick the correct milestone tier.
- Compute: renewal_value = miles × point_val.
`
  },

  notes: `Atlas gives accelerated travel rewards and annual milestone Edge Miles based on spend tier. Renewal modeled as dynamic milestone bonuses (Silver/Gold/Platinum).`
};
