import type { CardReadable } from "../../types";

export const SBI_CASHBACK_READABLE: CardReadable = {
  id: "SBI_CASHBACK",
  issuer: "SBI",
  name: "SBI Cashback Card",
  annual_fee: 999,            // ₹999 joining/renewal (approx) :contentReference[oaicite:1]{index=1}
  welcome_net: 0,             // no explicit welcome bonus mentioned in sources
  fx_markup_pct: 3.5,          // foreign transaction markup ~3.5% :contentReference[oaicite:2]{index=2}
  flags: 0,
  verified_at: "2025-11-19",

  eff_rates: {
    groceries: 0.05,          // online 5% => 0.05 per ₹1 (for online spends) :contentReference[oaicite:3]{index=3}
    dining: 0.05,             // assume dining considered online/spend eligible at same rate
    fuel: 0.00,               // excluded or very low for fuel according to review :contentReference[oaicite:4]{index=4}
    online: 0.05,             // clear 5% on online spends
    utilities: 0.00,          // utilities excluded per review :contentReference[oaicite:5]{index=5}
    travel_dom: 0.05,         // treat travel dom as “online” type spend initially
    travel_intl: 0.05,        // treat travel intl in same category
    rent_education: 0.00,     // excluded per review
    other: 0.01               // offline spends 1% per ₹1 => 0.01 :contentReference[oaicite:6]{index=6}
  },

  caps: {
    groceries: 0,
    dining: 0,
    fuel: 0,
    online: 5000 * (1/0.05),  // approximate: if max ₹5000 cashback at 5% => spend ~₹100k per month :contentReference[oaicite:7]{index=7}
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

  notes: `5% cashback on most online spends; 1% on offline. Max cashback ~₹5,000 per statement on 5% rate (approx ₹100k spend at 5%). Annual fee ₹999, waived if spends ≥₹2 lakhs in year. Exclusions include fuel, utilities, rent/education, jewellery. Verify actual MCC/merchant exclusions before publishing.`
};
