import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';
import { WhopCheckout } from '../../components/whop-checkout';

export const metadata: Metadata = {
  title: 'Checkout — Delight Digital',
  description: 'Complete your purchase of AI, Made Friendly — The Complete Bundle.',
  robots: { index: false, follow: false },
};

const REASSURANCE = [
  'Instant access after checkout',
  'Interactive workbook + printable PDF',
  'Yours to keep',
];

export default function CheckoutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* No competing nav actions during checkout. */}
      <SiteHeader showActions={false} />

      <main className="mx-auto max-w-2xl px-6 pb-16 pt-6 sm:pt-10">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
          The Complete Bundle &middot; AI, Made Friendly
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-book-ink sm:text-5xl">
          Complete your{' '}
          <span className="italic text-book-terra">purchase.</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-book-ink/75">
          You&rsquo;re one step away. Secure checkout is below — the moment
          it&rsquo;s done, you&rsquo;ll land on your welcome page with everything
          unlocked.
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {REASSURANCE.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 text-sm text-book-ink/70"
            >
              <Check className="h-4 w-4 shrink-0 text-book-terra" />
              {item}
            </li>
          ))}
        </ul>

        {/* Embedded Whop checkout — returns to /thank-you on success. */}
        <div className="mt-8">
          <WhopCheckout />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-book-stone">
          Payments are securely processed by Whop. By purchasing you agree to our{' '}
          <a
            href="/terms"
            className="underline underline-offset-2 transition hover:text-book-terra"
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href="/refund"
            className="underline underline-offset-2 transition hover:text-book-terra"
          >
            Refund Policy
          </a>
          .
        </p>
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}
