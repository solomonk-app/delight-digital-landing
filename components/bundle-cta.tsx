'use client';

import { useEffect, useState } from 'react';
import { BUNDLE_PRICE } from './site-config';
import { CURRENCY } from './analytics-config';

/* --------------------------------------------------------------------------
 *  BundleCta — the "Get the bundle" button used across /bundle.
 *
 *  - Links to /checkout, PRESERVING the current query string (utm_*, gclid, …)
 *    so ad attribution carries across this same-domain hop.
 *  - Fires a GA4 `begin_checkout` on click for funnel visibility.
 *  - Deliberately fires NO Google Ads conversion — the purchase conversion
 *    lives only on /thank-you, so /bundle can never double-count.
 * ------------------------------------------------------------------------ */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function BundleCta({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  // SSR renders a plain /checkout link; after hydration we append the live
  // query string so utm_*/gclid follow the visitor into checkout.
  const [href, setHref] = useState('/checkout');
  useEffect(() => {
    setHref('/checkout' + window.location.search);
  }, []);

  const handleClick = () => {
    try {
      window.gtag?.('event', 'begin_checkout', {
        value: BUNDLE_PRICE,
        currency: CURRENCY,
      });
    } catch {
      /* analytics is best-effort; never block navigation */
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
