import type { CardReadable } from "../../types";

export const AXIS_MAGNUS_READABLE: CardReadable = {
  id: "AXIS_MAGNUS",
  issuer: "Axis Bank",
  name: "Axis Magnus Credit Card",
  annual_fee: 12500,           // ₹12,500 (approx; GST may be extra)
  welcome_net: 12500,          // conservative valuation of joining benefit / vouchers
  fx_markup_pct: 2.0,          // low FX markup advertised
  flags: 0,
  verified_at: "2025-11-17",

  // Reward assumptions (values are INR-equivalents per ₹1 spent)
  // Axis publishes points per ₹200; we convert:
  // 12 points / ₹200 => 12/200 = 0.06 value-per-₹1 (assuming 1 EDGE ≈ ₹1)
  // 35 points / ₹200 => 35/200 = 0.175 value-per-₹1 (accelerated on incremental spends)
  //
  // Rule: excluded => 0.00, base-eligible => baseRate (0.06), accelerated => 0.175
  eff_rates: {
    groceries: 0.06,         // base earn (12 pts / ₹200)
    dining: 0.06,            // base earn (12 / 200)
    fuel: 0.00,              // excluded
    online: 0.06,            // base earn (12 / 200)
    utilities: 0.00,         // excluded
    travel_dom: 0.06,        // base; accelerated above monthly threshold handled via caps/notes
    travel_intl: 0.06,       // base
    rent_education: 0.00,    // excluded
    other: 0.06
  },

  // caps (INR). Axis T&Cs define accelerated apply above ₹1.5L per month.
  // We'll encode the primary monthly threshold as an annual equivalent for converter use:
  // 1.5 L * 12 = 1,800,000 (annual threshold where accelerated points start).
  //
  // You may prefer to represent monthly caps separately; converter can be adapted.
  caps: {
    groceries: 0,
    dining: 0,
    fuel: 0,
    online: 0,
    utilities: 0,
    // cap here represents the monthly threshold * 12 => annual cap to reach accelerated band.
    travel_dom: 1800000,     // 1.5L per month × 12 = 1,800,000 per year
    travel_intl: 1800000,
    rent_education: 0,
    other: 0
  },

  // post_cap_rates: effective rate applied *above* the cap band or as fallback
  // Axis T&C: accelerated points (35/200) apply to incremental spends above 1.5L monthly,
  // base points credited for all eligible spends (12/200). We'll model post-cap as higher
  // (accelerated) — actual implementation during scoring should compute a tiered reward:
  // base on first ₹1.5L/month, accelerated on incremental spend, then fallback if limits reached.
  post_cap_rates: {
    groceries: 0.06,
    dining: 0.06,
    fuel: 0.00,
    online: 0.06,
    utilities: 0.00,
    travel_dom: 0.175,       // incremental accelerated equivalent (35/200)
    travel_intl: 0.175,
    rent_education: 0.00,
    other: 0.06
  },

  // friendly metadata (not used by compact runtime but useful for admins / UI)
  exclusions: [
    "wallet_loads",
    "rent_payments_via_3rd_party",
    "fuel",
    "insurance_premiums",
    "government_payments",
    "EMI_payments"
  ],

  notes: `Based on Axis published T&C and product pages: base earn 12 EDGE/₹200 (0.06 per ₹1),
accelerated 35 EDGE/₹200 (0.175 per ₹1) on incremental spends above ₹1.5L per calendar month (subject to credit-limit related caps).
Annual fee and welcome vouchers set conservatively at ₹12,500. FX markup assumed 2%. Verify exact T&Cs before publishing.`,
};
