/* ==========================================================================
 *  ANALYTICS & CONVERSION CONFIG  —  the ONE place to edit
 *  --------------------------------------------------------------------------
 *  Every Google tag ID, purchase value, and URL-param name lives here so
 *  there is a single source of truth. The site-wide tag (components/google-tag)
 *  and the /thank-you conversion tracker (components/conversion-tracker) both
 *  import from this file — nothing is hard-coded anywhere else.
 *
 *  ⚠️  CONFIRM BEFORE REAL AD TRAFFIC — replace any value below that is a
 *      placeholder rather than your real one:
 *        • GA4_MEASUREMENT_ID    GA4 → Admin → Data streams → "G-XXXXXXXXXX"
 *        • ADS_CONVERSION_ID     Google Ads → Goals → Conversions → tag → "AW-XXXXXXXXXX"
 *        • ADS_CONVERSION_LABEL  the label of the specific "Purchase" conversion action
 *        • the Whop URL param names (ORDER_ID / VALUE) — confirm after one test purchase
 * ========================================================================== */

/* ---- Google tag IDs ------------------------------------------------------ */
// TODO: confirm these are your real IDs (they were provided in the brief).
export const GA4_MEASUREMENT_ID = 'G-0FL30P2YQF';
export const ADS_CONVERSION_ID = 'AW-18011983033';
export const ADS_CONVERSION_LABEL = 'Jzz6CMyuntQcELmZ5IxD';

/* ---- Purchase value ------------------------------------------------------ */
export const DEFAULT_VALUE = 29.99; // used when Whop doesn't pass a value
export const CURRENCY = 'USD';

/* ---- Whop redirect params (CONFIRMED from a real test purchase) ----------- */
// A live Whop test order redirects with:
//   receipt_id=pay_…   payment_id=pay_…   checkout_status=success   status=success
// (no value param). So we gate on receipt_id and use it as the transaction id;
// payment_id is a same-value fallback, and the older guesses stay as a safety
// net. Whop does NOT pass a price, so every conversion reports DEFAULT_VALUE —
// keep DEFAULT_VALUE above in sync with the bundle's real price.
export const PURCHASE_PARAM = 'receipt_id';
export const ORDER_ID_PARAM = 'receipt_id';
export const ORDER_ID_PARAM_CANDIDATES = [
  'receipt_id', // confirmed — Whop order id (pay_…)
  'payment_id', // confirmed — same value as receipt_id
  // Older guesses, kept only as a safety net:
  'session_id',
  'checkout_session',
  'order_id',
  'membership_id',
];
export const VALUE_PARAM_CANDIDATES = ['value', 'amount', 'price', 'amount_total'];

/* ---- Testing ------------------------------------------------------------- */
// Flip to `true` to FORCE the conversions to fire even without a purchase param
// (a dry run). While true it fires on EVERY /thank-you load, so set it back to
// `false` before real traffic. For a safer one-shot test, instead visit
// /thank-you?receipt_id=TEST-001 (each distinct id fires exactly once).
export const TEST_MODE = false;
