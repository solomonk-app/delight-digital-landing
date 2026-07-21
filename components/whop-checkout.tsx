'use client';

import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { WHOP_PLAN_ID, WHOP_CHECKOUT_URL, SITE_URL } from './site-config';

/* --------------------------------------------------------------------------
 *  WhopCheckout — Whop's embedded checkout, rendered on our own /checkout page.
 *
 *  Why: Whop's hosted "redirect after checkout" tends to land buyers on Whop's
 *  own receipt page, so our /thank-you conversion never fires. The embed lets
 *  US own the return: after payment Whop redirects the browser to
 *  return-url (our /thank-you) with a `status` (and usually receipt_id), which
 *  the ConversionTracker uses to fire the GA4 + Ads conversions.
 *
 *  Until WHOP_PLAN_ID is set, this falls back to the hosted Whop checkout so
 *  the buy flow is never broken.
 * ------------------------------------------------------------------------ */

const WHOP_LOADER_SRC = 'https://js.whop.com/static/checkout/loader.js';
const PLAN_ID_PLACEHOLDER = 'plan_XXXXXXXXX';
// Absolute HTTPS return URL is required by Whop.
const RETURN_URL = `${SITE_URL}/thank-you`;

export function WhopCheckout() {
  const configured = !!WHOP_PLAN_ID && WHOP_PLAN_ID !== PLAN_ID_PLACEHOLDER;

  useEffect(() => {
    if (!configured) return;
    // Load Whop's embed loader once; it scans the DOM for the checkout div.
    if (document.querySelector(`script[src="${WHOP_LOADER_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = WHOP_LOADER_SRC;
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }, [configured]);

  if (!configured) {
    // Graceful fallback — no plan id yet, so send buyers to the hosted checkout.
    return (
      <div className="rounded-2xl border border-book-line bg-book-cream/60 p-8 text-center">
        <p className="text-book-ink/75">
          Secure checkout is opening on our payment partner, Whop.
        </p>
        <a
          href={WHOP_CHECKOUT_URL}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-book-terra px-7 py-3.5 text-base font-semibold text-white shadow-terra transition hover:bg-book-rose"
        >
          Continue to checkout
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div
      data-whop-checkout-plan-id={WHOP_PLAN_ID}
      data-whop-checkout-return-url={RETURN_URL}
      data-whop-checkout-theme="light"
      className="min-h-[640px] w-full overflow-hidden rounded-2xl border border-book-line bg-book-cream/40"
    />
  );
}
