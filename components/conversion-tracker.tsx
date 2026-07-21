'use client';

import { useEffect, useRef } from 'react';
import {
  ADS_CONVERSION_ID,
  ADS_CONVERSION_LABEL,
  DEFAULT_VALUE,
  CURRENCY,
  TEST_MODE,
  PURCHASE_PARAM,
  ORDER_ID_PARAM,
  ORDER_ID_PARAM_CANDIDATES,
  VALUE_PARAM_CANDIDATES,
} from './analytics-config';

/* --------------------------------------------------------------------------
 *  ConversionTracker — fires the purchase conversions, ONCE, and only on a
 *  genuine post-checkout redirect. Rendered only by /thank-you.
 *
 *  Guarantees:
 *   • Nothing fires unless a purchase/order param is present (or TEST_MODE).
 *   • Exactly one GA4 `purchase` and one Google Ads `conversion` per order.
 *   • A given transaction_id is never counted twice (localStorage dedupe),
 *     so refresh / back-button can't double-count.
 * ------------------------------------------------------------------------ */

declare global {
  interface Window {
    // gtag is defined by the inline init in <head> (see components/google-tag).
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const DEDUPE_PREFIX = 'dd_conv_fired:';

function alreadyFired(id: string): boolean {
  try {
    return window.localStorage.getItem(DEDUPE_PREFIX + id) === '1';
  } catch {
    return false; // private mode / storage blocked — fall through, see below
  }
}

function markFired(id: string): void {
  try {
    window.localStorage.setItem(DEDUPE_PREFIX + id, '1');
  } catch {
    /* storage unavailable — best effort only */
  }
}

export function ConversionTracker() {
  // Guard against React double-invoking the effect (e.g. Strict Mode).
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);

    // 1) Find an order / transaction id: primary guesses first, then candidates.
    const orderParamNames = [
      PURCHASE_PARAM,
      ORDER_ID_PARAM,
      ...ORDER_ID_PARAM_CANDIDATES,
    ];
    let orderId = '';
    for (const name of orderParamNames) {
      const v = params.get(name);
      if (v) {
        orderId = v;
        break;
      }
    }

    const hasPurchaseParam = orderId !== '';

    // 2) Gate: only a real post-checkout redirect (param present) — or TEST_MODE.
    //    Direct visits with no param show the page but fire nothing.
    if (!hasPurchaseParam && !TEST_MODE) return;

    // 3) Resolve the value from the URL if Whop passed it, else the default.
    let value = DEFAULT_VALUE;
    for (const name of VALUE_PARAM_CANDIDATES) {
      const raw = params.get(name);
      if (raw != null && raw !== '') {
        const n = Number.parseFloat(raw);
        if (Number.isFinite(n) && n >= 0) {
          value = n;
          break;
        }
      }
    }

    // 4) transaction_id: the real order id, or a generated fallback (TEST_MODE).
    const transactionId =
      orderId ||
      `DD-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;

    // 5) Dedupe — never fire the same transaction twice.
    if (alreadyFired(transactionId)) return;

    const gtag = window.gtag;
    if (typeof gtag !== 'function') return; // tag not present; nothing to do

    // GA4 purchase event.
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency: CURRENCY,
    });

    // Google Ads conversion event.
    gtag('event', 'conversion', {
      send_to: `${ADS_CONVERSION_ID}/${ADS_CONVERSION_LABEL}`,
      value,
      currency: CURRENCY,
      transaction_id: transactionId,
    });

    // Mark fired only after we've actually sent them.
    markFired(transactionId);
  }, []);

  return null;
}
