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

// The bundle's price — single source of truth. Shown on the sales pages and
// reused as the GA4/Ads conversion value (see analytics-config DEFAULT_VALUE).
// Keep equal to the Whop plan price.
export const BUNDLE_PRICE = 29.99;

// What's inside "AI, Made Friendly — The Complete Bundle" — the accurate full
// list, used on the /bundle sales page so the contents live in one place.
export const BUNDLE_CONTENTS: { title: string; detail: string }[] = [
  {
    title: '75-page interactive workbook',
    detail: 'Fill it in as you go — it saves on your device.',
  },
  {
    title: 'Fillable online workbook + certificate',
    detail: 'Practise in your browser and earn your completion certificate.',
  },
  {
    title: 'The reference hub',
    detail: '120+ ready-to-use prompts and a tool picker to look things up any time.',
  },
  {
    title: '155 parent prompts',
    detail: 'Real, everyday prompts for family life.',
  },
  {
    title: '18 caregiver prompts',
    detail: 'Extra prompts written for caregivers.',
  },
  {
    title: '“Which AI for Which Task” printable',
    detail: 'A one-page guide to picking the right tool for the job.',
  },
  {
    title: '50 prompts + 25 follow-ups + the 25-move Answer Rescue Kit',
    detail: 'Turn a so-so first answer into a genuinely useful one.',
  },
  {
    title: 'The PAUSE scam check + privacy habits',
    detail: 'Spot a scam before it fools you, and keep your information safe.',
  },
  {
    title: 'Printable cards',
    detail: 'Keep the essentials by your desk.',
  },
  {
    title: 'Lifetime access + free updates',
    detail: 'Yours to keep, kept current as the tools change.',
  },
  {
    title: 'Free Quick-Start Guide',
    detail: 'The 16-page beginner’s guide, included.',
  },
];
