import { GA4_MEASUREMENT_ID, ADS_CONVERSION_ID } from './analytics-config';

/* --------------------------------------------------------------------------
 *  GoogleTag — the standard gtag.js loader.
 *
 *  Rendered exactly ONCE, in the root layout's <head>, so it loads on every
 *  page. That's what lets the ad click's GCLID be captured on the landing page
 *  and stay available (via first-party cookies) on /thank-you for attribution.
 *
 *  It only LOADS the tag and runs gtag('config', …) for GA4 + Google Ads.
 *  It never fires a conversion — that happens only on /thank-you via
 *  <ConversionTracker />. Do not add this component anywhere else.
 * ------------------------------------------------------------------------ */
export function GoogleTag() {
  return (
    <>
      {/* Loader — React de-dupes by src, so it is never included twice. */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
      />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: [
            'window.dataLayer = window.dataLayer || [];',
            'function gtag(){dataLayer.push(arguments);}',
            "gtag('js', new Date());",
            `gtag('config', '${GA4_MEASUREMENT_ID}');`,
            `gtag('config', '${ADS_CONVERSION_ID}');`,
          ].join('\n'),
        }}
      />
    </>
  );
}
