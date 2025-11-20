import type { CardReadable } from "../../types";

export const SBI_CASHBACK_READABLE: CardReadable = {
  id: "SBI_CASHBACK",
  issuer: "SBI",
  name: "SBI Cashback Card",
  annual_fee: 999,            // ₹999 joining/renewal (approx)
  welcome_net: 0,             // no explicit welcome bonus captured here
  fx_markup_pct: 3.5,         // foreign tx markup (approx)
  flags: 0,
  verified_at: "2025-11-19",

  eff_rates: {
    groceries: 0.05,          // online/category cashback modeled as 5% => 0.05 per ₹1
    dining: 0.05,
    fuel: 0.00,
    online: 0.05,
    utilities: 0.00,
    travel_dom: 0.05,
    travel_intl: 0.05,
    rent_education: 0.00,
    other: 0.01
  },

  caps: {
    groceries: 0,
    dining: 0,
    fuel: 0,
    // approximate monthly cap inferred from reviews: max cashback ₹5,000 on 5% category -> spend ~₹100,000
    // if you prefer, store explicit cashback caps instead of deriving from rates
    online: 100000 * 12, // conservatively treat as annual allowance equivalent (if needed)
    utilities: 0,
    travel_dom: 0,
    travel_intl: 0,
    rent_education: 0,
    other: 0
  },

  post_cap_rates: {
    groceries: 0.05,
    dining: 0.05,
    fuel: 0.00,
    online: 0.05,
    utilities: 0.00,
    travel_dom: 0.05,
    travel_intl: 0.05,
    rent_education: 0.00,
    other: 0.01
  },

  exclusions: [
    "fuel",
    "rent_payments",
    "education_fee",
    "insurance_premiums",
    "utilities",
    "wallet_loads",
    "jewellery",
    "government_payments"
  ],

  // --- NEW: renewal block ---
  renewal: {
    type: "fee_waiver",            // fee is waived on meeting the condition
    fee_waiver: true,
    value_in_inr: 0,               // fee_waiver implies appliedFee = 0; value_in_inr not used
    condition: {
      annual_spend_threshold: 200000 // waive annual fee if annual eligible spend >= ₹200,000
    },
    applies_first_year: false,     // waiver applies at renewal (not immediate at signup)
    notes: "Waives the annual fee (₹999) at renewal if total annual spend across eligible categories >= ₹200,000. Confirm MCC/eligible categories per bank T&C."
  },

  notes: `5% cashback on most online spends; 1% on offline. Typical waiver: Ṭhe annual fee (₹999) is commonly waived if spends ≥ ₹200,000/yr. Verify exact T&Cs and statement cashback caps.`
};
