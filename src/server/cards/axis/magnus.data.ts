import type { CardReadable } from "../../types";

export const AXIS_MAGNUS_READABLE: CardReadable = {
  id: "AXIS_MAGNUS",
  issuer: "Axis Bank",
  name: "Axis Bank Magnus Credit Card",
  annual_fee: 12500,                 // Verified: ₹12,500 + GST
  welcome_net: 12500,                // Conservative value for joining voucher (changed but still ~₹12k value)
  fx_markup_pct: 2.0,                // Verified low-forex premium card rate
  flags: 0,
  verified_at: "2025-11-19",

  // ------------------------------------------------------------------
  // REWARD RATES
  // ------------------------------------------------------------------
  // Accurate earn structure (post-2023 revision):
  // Base earn: 12 EDGE points per ₹200 → 12/200 = 0.06 INR/₹100 → 0.0006 per ₹1.
  // But since your system uses INR-return-per-INR-spent, and we model 1 EDGE Mile = ₹1 conservatively,
  // we express: (12 / 200 = 0.06 INR returned per ₹1 of spend).
  //
  // Accelerated earn:
  // - 35 EDGE/₹200 (only above ₹1.5L monthly threshold)
  // - 60 EDGE/₹200 on Travel EDGE portal (up to ₹2L monthly)
  //
  // In CardReadable, only store BASE per-category earn.
  // Portal-boost / threshold logic belongs in scoring layer.
  eff_rates: {
    groceries: 0.06,           // Base eligible
    dining: 0.06,
    fuel: 0.00,                // Excluded
    online: 0.06,
    utilities: 0.00,           // Excluded
    travel_dom: 0.06,
    travel_intl: 0.06,
    rent_education: 0.00,      // Excluded
    other: 0.06
  },

  // ------------------------------------------------------------------
  // CAPS
  // ------------------------------------------------------------------
  // For scoring simplicity: cap base earn at the 1.5L monthly threshold → annually: 18,00,000
  // After cap, accelerated (35/200) applies → handled in post_cap_rates
  // Travel EDGE portal cap is separate (₹2L monthly) → not category-based, so scoring layer should handle this separately.
  caps: {
    groceries: 1800000,
    dining: 1800000,
    fuel: 0,
    online: 1800000,
    utilities: 0,
    travel_dom: 1800000,
    travel_intl: 1800000,
    rent_education: 0,
    other: 1800000
  },

  // ------------------------------------------------------------------
  // POST-CAP RATES (accelerated slab)
  // ------------------------------------------------------------------
  // Above ₹1.5 lakh monthly cap → 35 EDGE/₹200 → 0.175 INR/₹1
  post_cap_rates: {
    groceries: 0.175,
    dining: 0.175,
    fuel: 0.00,
    online: 0.175,
    utilities: 0.00,
    travel_dom: 0.175,
    travel_intl: 0.175,
    rent_education: 0.00,
    other: 0.175
  },

  // ------------------------------------------------------------------
  // EXCLUSIONS (verified)
  // ------------------------------------------------------------------
  exclusions: [
    "fuel",
    "rent_payments",
    "wallet_loads",
    "government_payments",
    "insurance_premiums",
    "utilities",
    "education_fee",
    "jewellery"
  ],

  // ------------------------------------------------------------------
  // RENEWAL (accurate)
  // ------------------------------------------------------------------
  // As per Moneycontrol + various bank communications:
  // Annual fee waiver only if annual spends >= ₹25,00,000 (25 lakh).
  // No more milestone vouchers or bonus-points.
  renewal: {
    type: "fee_waiver",
    fee_waiver: true,
    condition: {
      annual_spend_threshold: 2500000      // ₹25 lakh
    },
    applies_first_year: false,
    notes: `
Post-2023 changes: Magnus no longer gives milestone vouchers or renewal bonus.
Annual fee is waived ONLY if annual spends >= ₹25,00,000 (verified).
No other renewal benefits currently documented.`
  },

  // UI Notes
  notes: `
Axis Magnus (post-Sept 2023 changes) provides:
- 12/200 base points,
- 35/200 accelerated above ₹1.5L monthly,
- 60/200 on Travel EDGE portal up to ₹2L monthly cap.
Renewal fee is waived only after ₹25L annual spend.
Most non-travel categories remain excluded.
`
};
