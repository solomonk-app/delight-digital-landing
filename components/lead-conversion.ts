import { ADS_CONVERSION_ID, LEAD_CONVERSION_LABEL } from './analytics-config';

/* --------------------------------------------------------------------------
 *  fireLeadConversion — call ONCE, only after a genuine MailerLite success.
 *
 *  Fires the Google Ads "Lead" conversion + a GA4 `generate_lead` event, and
 *  (for enhanced conversions) hands gtag the email we already have. Deduped by
 *  a hash of the email in localStorage, so rapid re-submits / refreshes for the
 *  same address never double-count.
 *
 *  Used from the shared SignupForm, so all capture points (hero + footer) are
 *  covered in one place.
 * ------------------------------------------------------------------------ */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const DEDUPE_PREFIX = 'dd_lead_fired:';

// Small stable non-crypto hash (FNV-1a) — keys the dedupe on the email without
// storing the address itself in plaintext.
function hashEmail(normalizedEmail: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < normalizedEmail.length; i++) {
    h ^= normalizedEmail.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function alreadyFired(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function markFired(key: string): void {
  try {
    window.localStorage.setItem(key, '1');
  } catch {
    /* storage unavailable — best effort only */
  }
}

export function fireLeadConversion(email: string): void {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  // Dedupe — never fire twice for the same address on this device.
  const key = DEDUPE_PREFIX + hashEmail(normalized);
  if (alreadyFired(key)) return;

  const gtag = window.gtag;
  if (typeof gtag !== 'function') return; // tag not ready; don't mark, allow retry

  // Enhanced conversions for leads: pass the email we already have. gtag hashes
  // it client-side; only used if enhanced conversions is enabled in Google Ads.
  gtag('set', 'user_data', { email: normalized });

  // Google Ads "Lead" conversion.
  gtag('event', 'conversion', {
    send_to: `${ADS_CONVERSION_ID}/${LEAD_CONVERSION_LABEL}`,
  });

  // GA4 parity.
  gtag('event', 'generate_lead', { value: 1, currency: 'USD' });

  markFired(key);
}
