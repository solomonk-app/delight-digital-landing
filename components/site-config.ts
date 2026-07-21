/* -------------------------------------------------------------------------- */
/*  Shared site constants — imported by the homepage, footer, and legal pages   */
/*  so URLs and the contact address live in exactly one place.                  */
/* -------------------------------------------------------------------------- */

// The reference field guide (look things up, grab a prompt). Passcode-gated;
// the free guide is reachable without one.
export const AI_APP_URL = 'https://ai.delightdigital.online';

// This site's own origin — used to build absolute URLs (e.g. the Whop embed
// return URL, which must be an absolute HTTPS link).
export const SITE_URL = 'https://guide.delightdigital.online';

// Paid product: the public Whop sales/checkout page for
// "AI, Made Friendly — The Complete Bundle" (anonymous visitors can buy here).
// Used as the fallback when the on-site embedded checkout isn't configured yet.
export const WHOP_CHECKOUT_URL =
  'https://whop.com/joined/delightdigital/products/ai-made-friendly-the-complete-bundle/';

// Whop plan id for the embedded checkout on /checkout — the $29.98 one-time
// pricing option of "AI, Made Friendly — The Complete Bundle" (prod_JXlRYiN4PvYC0).
// If this is ever blanked/changed to the placeholder, /checkout gracefully
// falls back to WHOP_CHECKOUT_URL above.
export const WHOP_PLAN_ID: string = 'plan_yPkYjXxLpzrcJ';

// Buyer-only interactive workbook, gated by a Whop entitlement check.
export const WORKBOOK_URL = 'https://workbook.delightdigital.online';

// Support / contact address, used across the legal pages and footer.
export const SUPPORT_EMAIL = 'hello@delightdigital.online';
