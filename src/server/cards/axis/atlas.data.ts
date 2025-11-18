import type { CardReadable } from "../../types";

export const AXIS_ATLAS_READABLE: CardReadable = {
  id: "AXIS_ATLAS",
  issuer: "Axis Bank",
  name: "Axis Atlas Credit Card",
  annual_fee: 5000,              // INR (adjust if you store GST separately)
  welcome_net: 2500,             // conservative INR value of welcome benefits
  fx_markup_pct: 3.5,            // FX markup in percent
  flags: 0,
  verified_at: "2025-11-17",

  // eff_rates keyed by category id (category ids must match your categories registry)
  // Rule used: excluded => 0.00, base-eligible => 0.02, accelerated => 0.05
  eff_rates: {
    groceries: 0.02,
    dining: 0.02,
    fuel: 0.00,                // excluded
    online: 0.02,
    utilities: 0.00,          // excluded
    travel_dom: 0.05,         // accelerated (5 EDGE/₹100)
    travel_intl: 0.05,        // accelerated
    rent_education: 0.00,     // excluded
    other: 0.02
  },

  // caps (INR). Keys optional — converter will map to category index.
  // Travel cap: assume ₹2 lakh/month => ₹2,40,00,00 per year (2,00000 * 12 = 2,400,000)
  caps: {
    groceries: 0,
    dining: 0,
    fuel: 0,
    online: 0,
    utilities: 0,
    travel_dom: 2400000,
    travel_intl: 2400000,
    rent_education: 0,
    other: 0
  },

  // post_cap_rates: fallback rate applied once cap exceeded
  post_cap_rates: {
    groceries: 0.02,
    dining: 0.02,
    fuel: 0.00,
    online: 0.02,
    utilities: 0.00,
    travel_dom: 0.02,        // fallback to base after cap
    travel_intl: 0.02,
    rent_education: 0.00,
    other: 0.02
  },

  // human-oriented extras (not used by compact format, but useful for docs/admin)
  exclusions: [
    "wallet_loads",
    "rent_payments_via_3rd_party",
    "fuel",
    "insurance_premiums",
    "government_payments",
    "EMI_payments"
  ],

  notes: `Assumptions: base earn = 2 EDGE/₹100 => 0.02 value-per-INR,
travel = 5 EDGE/₹100 (accelerated) with monthly cap approximated to ₹2,00,000/month (annual 2,400,000).
Confirm exact caps, merchant/portal multipliers and exclusions with Axis Bank product page before publishing.`
};
