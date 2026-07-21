import type { Metadata } from 'next';
import {
  Check,
  ArrowRight,
  Clock,
  Repeat,
  Download,
  Compass,
} from 'lucide-react';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';
import { BundleCta } from '../../components/bundle-cta';
import {
  SITE_URL,
  BUNDLE_PRICE,
  BUNDLE_CONTENTS,
  SUPPORT_EMAIL,
} from '../../components/site-config';

const PRICE = `$${BUNDLE_PRICE.toFixed(2)}`;

export const metadata: Metadata = {
  title: 'AI, Made Friendly — The Complete Bundle | Delight Digital',
  description:
    'Learn AI by doing — one useful task at a time. A calm beginner’s bundle: interactive + printable workbook, 120+ prompts, a reference hub, and a 30-day plan. One-time, lifetime access, 7-day refund.',
  alternates: { canonical: `${SITE_URL}/bundle` },
  openGraph: {
    title: 'AI, Made Friendly — The Complete Bundle',
    description:
      'Learn AI by doing — one useful task at a time. Interactive + printable, 120+ prompts, a 30-day plan. One-time purchase, lifetime access.',
    type: 'website',
  },
};

/* CTA button styles, reused so every "Get the bundle" looks identical. */
const HEADER_BTN =
  'inline-flex items-center whitespace-nowrap rounded-lg bg-book-terra px-4 py-2 text-sm font-semibold text-white transition hover:bg-book-rose';
const PRIMARY_BTN =
  'group inline-flex items-center justify-center gap-2 rounded-xl bg-book-terra px-8 py-4 text-base font-semibold text-white shadow-terra transition hover:bg-book-rose';

const AUDIENCES = [
  'Parents who want to keep up',
  'Caregivers and grandparents',
  'Late starters who feel behind',
  'Anyone who’s never opened ChatGPT',
];

const HOW_IT_WORKS = [
  {
    icon: <Compass className="h-5 w-5" />,
    title: 'Start anywhere',
    body: 'Pick the 7-day starter week or the full 30-day plan. The tasks stand alone — begin with whatever’s useful today.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Five-minute tasks',
    body: 'Each one is a short, do-it-with-me lab. The exact words to type are right there, so the blank box stops being scary.',
  },
  {
    icon: <Check className="h-5 w-5" />,
    title: 'Build real habits',
    body: 'You practise on real tasks from your actual life — so it sticks, and you keep using it after you finish.',
  },
];

const FAQS = [
  {
    q: 'Do I need any tech experience?',
    a: 'None. If you can send an email, you can do this. Every task starts with the exact words to type.',
  },
  {
    q: 'What if I’ve never used ChatGPT?',
    a: 'That’s exactly who this is for. We start from opening the tool for the very first time and build up gently from there.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. It’s a one-time purchase with lifetime access and free updates — no recurring charges, ever.',
  },
  {
    q: 'How fast do I have to go?',
    a: 'At your own pace. Tasks take about five minutes. Do one a day, or a few on a quiet afternoon — there’s no clock.',
  },
  {
    q: 'When do I get access?',
    a: 'Instantly. The moment checkout is done you land on your welcome page with everything unlocked.',
  },
  {
    q: 'What if it’s not right for me?',
    a: `Email ${SUPPORT_EMAIL} within 7 days of purchase for a refund. No fuss.`,
  },
];

export default function BundlePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Focused header — logo + a single "Get the bundle" button, no nav. */}
      <SiteHeader
        cta={<BundleCta className={HEADER_BTN}>Get the bundle</BundleCta>}
      />

      {/* -------------------------------------------------------------- Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-8 text-center sm:pt-14">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
          The Complete Bundle &middot; AI, Made Friendly
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-book-ink sm:text-5xl lg:text-6xl">
          Learn AI by doing — one useful task at a{' '}
          <span className="italic text-book-terra">time.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-book-ink/75">
          It’s more than an ebook. It’s a do-it-with-me workbook that turns “I
          don’t really get AI” into “I use it every day” — starting with real
          tasks from your actual life.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="font-serif text-3xl text-book-ink">
            {PRICE}{' '}
            <span className="align-middle font-sans text-sm font-normal text-book-stone">
              one-time &middot; lifetime access
            </span>
          </p>
          <BundleCta className={PRIMARY_BTN}>
            Get the bundle
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </BundleCta>
          <p className="text-sm text-book-stone">
            Instant access &middot; Interactive + printable &middot; 7-day refund
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ What's inside */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
            Everything that’s{' '}
            <span className="italic text-book-terra">inside.</span>
          </h2>
          <p className="mt-3 text-book-ink/70">
            One friendly bundle — the workbook, the practice, the prompts, and
            the safety net.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BUNDLE_CONTENTS.map((item) => (
            <li
              key={item.title}
              className="flex gap-3 rounded-2xl border border-book-line bg-book-cream/60 p-5"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-book-terra/15 text-book-terra">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-semibold text-book-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-book-ink/70">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------------- Who it's for */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
          Made for complete{' '}
          <span className="italic text-book-terra">beginners.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-book-ink/70">
          No jargon, no assumptions, no feeling behind. If you’ve been meaning to
          “figure out AI” but didn’t know where to start — this is for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {AUDIENCES.map((a) => (
            <span
              key={a}
              className="rounded-full border border-book-line bg-white/60 px-4 py-2 text-sm font-medium text-book-ink"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
            How it{' '}
            <span className="italic text-book-terra">works.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-book-line bg-book-cream/60 p-6"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-book-line bg-white/60 text-book-terra">
                {step.icon}
              </span>
              <h3 className="font-serif text-xl text-book-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-book-ink/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- More than an ebook */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[1.75rem] bg-book-espresso p-8 shadow-book sm:p-12">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
            Why it’s more than an ebook
          </p>
          <p className="mt-5 font-serif text-2xl leading-snug text-book-cream sm:text-3xl">
            An ebook tells you <span className="text-book-cream/60">about</span>{' '}
            AI. This does it{' '}
            <span className="italic text-book-terra">with</span> you.
          </p>
          <p className="mt-5 max-w-xl leading-relaxed text-book-cream/70">
            Real prompts, real tasks, a fillable workbook, and a reference hub
            you’ll keep coming back to. You don’t just read — you practise on
            your own everyday life, so you finish with habits, not highlights.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-book-lined bg-black/20 px-3.5 py-1.5 text-[13px] font-medium text-book-cream/85">
              <Repeat className="h-4 w-4 text-book-terra" /> Do-it-with-me labs
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-book-lined bg-black/20 px-3.5 py-1.5 text-[13px] font-medium text-book-cream/85">
              <Download className="h-4 w-4 text-book-terra" /> Interactive + printable
            </span>
          </div>
        </div>
      </section>

      {/*
        SOCIAL PROOF / TESTIMONIALS — intentionally left empty.
        Add real, approved customer quotes here only. Do NOT invent testimonials,
        star ratings, customer counts, or results.
      */}

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
            Questions,{' '}
            <span className="italic text-book-terra">answered.</span>
          </h2>
        </div>
        <dl className="space-y-6">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-book-line bg-book-cream/40 p-6"
            >
              <dt className="font-serif text-lg text-book-ink">{f.q}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-book-ink/70">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------ Promise + disclaimer */}
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="mx-auto max-w-xl font-serif text-2xl leading-snug text-book-ink">
          You’re not behind. You’re just{' '}
          <span className="italic text-book-terra">beginning.</span>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-book-stone">
          This is educational content to help you use AI with confidence. AI can
          be confidently wrong, so always double-check anything that matters — you
          are the decision-maker. Not medical, legal, or financial advice.
        </p>
      </section>

      {/* --------------------------------------------------------- Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[1.75rem] border border-book-line bg-book-cream/60 px-6 py-14 text-center">
          <h2 className="mx-auto max-w-xl font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
            Start using AI this week.
          </h2>
          <p className="mt-3 font-serif text-2xl text-book-ink">
            {PRICE}{' '}
            <span className="align-middle font-sans text-sm font-normal text-book-stone">
              one-time &middot; lifetime access
            </span>
          </p>
          <div className="mt-7 flex justify-center">
            <BundleCta className={PRIMARY_BTN}>
              Get the bundle
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </BundleCta>
          </div>
          <p className="mt-4 text-sm text-book-stone">
            Instant access &middot; Interactive + printable &middot; 7-day refund
          </p>
          <p className="mt-8 text-sm text-book-stone/90">
            Not ready?{' '}
            <a
              href="/#get-guide"
              className="font-medium text-book-terra underline-offset-4 transition hover:underline"
            >
              Get the free guide &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* Legal footer only — no signup CTA competing with the offer. */}
      <SiteFooter showCta={false} />
    </div>
  );
}
