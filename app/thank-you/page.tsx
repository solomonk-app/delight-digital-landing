import type { Metadata } from 'next';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Mail,
  Check,
} from 'lucide-react';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';
import { ConversionTracker } from '../../components/conversion-tracker';
import {
  WORKBOOK_URL,
  AI_APP_URL,
  SUPPORT_EMAIL,
} from '../../components/site-config';

export const metadata: Metadata = {
  title: 'You’re in — Delight Digital',
  description: 'Your order is confirmed. Here’s how to open what you just unlocked.',
  // A post-purchase page shouldn't show up in search results.
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    title: 'Instant access',
    body: 'Everything is unlocked right now — the interactive workbook, the printable PDF, and both companion sites.',
  },
  {
    title: 'Check your email',
    body: 'Your receipt and sign-in details are on their way from Whop. If you don’t see them in a minute, have a look in your spam folder.',
  },
  {
    title: 'Open your workbook',
    body: 'Use the button below to jump straight in. It saves your progress on your device as you go.',
  },
];

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fires the GA4 purchase + Google Ads conversion — only on a genuine
          post-checkout redirect, exactly once. Renders nothing. */}
      <ConversionTracker />

      <SiteHeader showActions={false} />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-6 sm:pt-10">
        {/* Confirmation badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-book-terra/40 bg-book-terra/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-book-terra">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          Order confirmed
        </span>

        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-book-ink sm:text-5xl">
          You’re in — welcome to{' '}
          <span className="italic text-book-terra">Delight Digital.</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-book-ink/75">
          You’re not behind. You’ve begun. Thank you for picking up the complete
          bundle — everything you need to start using AI for real, everyday
          tasks is ready and waiting for you.
        </p>

        {/* What happens next */}
        <section className="mt-10 rounded-2xl border border-book-line bg-book-cream/60 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-book-ink">What happens next</h2>
          <ol className="mt-5 space-y-5">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-book-terra font-mono text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-book-ink">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-book-ink/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={WORKBOOK_URL}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-book-terra px-7 py-3.5 text-base font-semibold text-white shadow-terra transition hover:bg-book-rose"
          >
            <BookOpen className="h-4 w-4" />
            Open your workbook
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={AI_APP_URL}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-book-line bg-white/60 px-7 py-3.5 text-base font-semibold text-book-ink transition hover:border-book-terra/60"
          >
            <Compass className="h-4 w-4 text-book-terra" />
            Explore the reference hub
          </a>
        </div>

        {/* Gentle first-step nudge */}
        <figure className="mt-12 max-w-xl border-l-2 border-book-terra pl-5">
          <blockquote className="font-serif text-xl leading-snug text-book-ink">
            “You don’t need to learn everything today. Open the workbook and start
            with one real task from your actual life.”
          </blockquote>
          <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-book-stone">
            Your first step
          </figcaption>
        </figure>

        {/* Support line */}
        <div className="mt-10 flex items-start gap-3 rounded-xl border border-book-line bg-book-cream/40 p-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-book-terra" />
          <p className="text-[15px] leading-relaxed text-book-ink/75">
            Any question at all — access, your receipt, or where to begin — email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-book-terra underline-offset-4 transition hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            and a real person will help you.
          </p>
        </div>
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}
