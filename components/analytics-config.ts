/* ==========================================================================
 *  ANALYTICS & CONVERSION CONFIG  —  the ONE place to edit
 *  --------------------------------------------------------------------------
 *  Every Google tag ID, purchase value, and URL-param name lives here so
 *  there is a single source of truth. The site-wide tag (components/google-tag)
 *  and the /thank-you conversion tracker (components/conversion-tracker) both
 *  import from this file — nothing is hard-coded anywhere else.
 *
 *  STATUS (2026-07-21): IDs, Ads label, currency, and value are CONFIRMED by
 *  the owner. GA4 id independently verified live (gtag/js returns a configured
 *  property). The only item still pending a live check is that Whop appends
 *  `receipt_id` to the /thank-you redirect (params were read off a real order;
 *  confirm once the Whop post-checkout redirect points at /thank-you).
 * ========================================================================== */

/* ---- Google tag IDs (confirmed by the owner, 2026-07-21) ------------------ */
export const GA4_MEASUREMENT_ID = 'G-0FL30P2YQF'; // GA4 property (verified live)
export const ADS_CONVERSION_ID = 'AW-18011983033'; // Google Ads conversion ID
export const ADS_CONVERSION_LABEL = 'Jzz6CMyuntQcELmZ5IxD'; // "Purchase" action label
// "Lead" action label — fires when a visitor subscribes to the free guide.
// Same Ads account (ADS_CONVERSION_ID); paste from Google Ads → this conversion action.
export const LEAD_CONVERSION_LABEL = 'L_kTCJ_jj9QcELmZ5IxD';

/* ---- Purchase value ------------------------------------------------------ */
export const DEFAULT_VALUE = 29.99; // confirmed bundle price (Whop passes no value)
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

// The embedded Whop checkout (/checkout) returns to /thank-you with a success
// flag — and may not include an order id. So a success flag ALSO counts as a
// genuine post-checkout redirect. (An order id is still preferred as the
// transaction id when present; otherwise a fallback id is generated.)
export const SUCCESS_FLAG_PARAMS = ['checkout_status', 'status'];
export const SUCCESS_FLAG_VALUE = 'success';

/* ---- Testing ------------------------------------------------------------- */
// Flip to `true` to FORCE the conversions to fire even without a purchase param
// (a dry run). While true it fires on EVERY /thank-you load, so set it back to
// `false` before real traffic. For a safer one-shot test, instead visit
// /thank-you?receipt_id=TEST-001 (each distinct id fires exactly once).
export const TEST_MODE = false;
