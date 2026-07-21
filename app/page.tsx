'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Play,
  BookOpen,
  Download,
  Check,
  FileText,
  UtensilsCrossed,
  PenLine,
  Scale,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SignupForm } from '../components/signup-form';
import { SiteHeader } from '../components/site-header';
import { SiteFooter } from '../components/site-footer';
import { AI_APP_URL, WORKBOOK_URL } from '../components/site-config';

/* -------------------------------------------------------------------------- */
/*  Sandbox data — a beginner prompt builder for real, everyday tasks.         */
/* -------------------------------------------------------------------------- */
const TASKS = [
  { value: 'write a thank-you note', label: 'Write a thank-you note' },
  {
    value: 'explain this letter in plain English',
    label: 'Explain a confusing letter',
  },
  { value: 'plan 3 simple weeknight dinners', label: 'Plan simple dinners' },
] as const;

const AUDIENCES = [
  { value: 'my doctor', label: 'my doctor' },
  { value: 'my grandmother', label: 'my grandmother' },
  { value: 'a busy family', label: 'a busy family' },
  { value: 'someone who hates jargon', label: 'someone who hates jargon' },
] as const;

const TONES = [
  { value: 'warm', label: 'Warm' },
  { value: 'plain and clear', label: 'Plain & clear' },
  { value: 'friendly', label: 'Friendly' },
] as const;

// One warm, useful mock answer per task. No API calls — this is a gentle preview.
const MOCK_RESPONSES: string[] = [
  'Dear Dr. [Name],\n\nThank you for the care and patience you showed me at my last visit. You took the time to explain things in plain language and never made me feel rushed — it made a hard week a little easier. I’m grateful.\n\nWith thanks,\n[Your name]',
  'Here’s what your letter is saying, in plain words:\n\n• They’ve received your request, and it’s being reviewed.\n• They need one more document from you by the date near the top.\n• Send it in time and nothing else is needed from you right now.\n\nNext step: find that date, send the document, keep a copy.\n(Always double-check anything important against the letter itself.)',
  'Three simple dinners for this week:\n\n1. Sheet-pan chicken + broccoli — 30 min, one tray, easy cleanup.\n2. Rice bowls — leftover veg, an egg on top, a splash of soy.\n3. Tomato pasta — pantry staples, done in 20.\n\nStart with #1 if you’re worn out — it’s the least effort.',
];

const STREAM_SPEED_MS = 16;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <Everyday />
      <Bundle />
      <SiteFooter />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero — reassurance on the left, the beginner sandbox on the right.         */
/* -------------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-10 pt-8 lg:grid-cols-2 lg:items-center lg:pt-14">
      {/* Left column */}
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
          <span className="h-1.5 w-1.5 rounded-full bg-book-terra" />
          AI, Made Friendly &middot; A Beginner&rsquo;s Guide
        </span>

        <h1 className="mt-6 font-serif text-5xl leading-[1.03] tracking-tight text-book-ink sm:text-6xl lg:text-[4.25rem]">
          You&rsquo;re not behind.
          <br />
          You&rsquo;re just{' '}
          <span className="italic text-book-terra">beginning.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-book-ink/75">
          A calm, practical way to start using AI in everyday life &mdash; one
          useful task at a time. No coding, no jargon, no feeling behind. Start
          with the free guide.
        </p>

        <div className="mt-9">
          <SignupForm id="get-guide" />
        </div>

        <Principle />
      </div>

      {/* Right column — the signature beginner sandbox */}
      <div className="animate-fade-up [animation-delay:120ms]">
        <Sandbox />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Principle — the brand's own words (not a fabricated testimonial).          */
/* -------------------------------------------------------------------------- */
function Principle() {
  return (
    <figure className="mt-10 max-w-lg border-l-2 border-book-terra pl-5">
      <blockquote className="font-serif text-xl leading-snug text-book-ink">
        &ldquo;You don&rsquo;t need to learn everything. Start with one real task
        from your actual life.&rdquo;
      </blockquote>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-book-stone">
        The Delight Digital promise
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sandbox — build a real everyday prompt, watch a warm answer appear.        */
/* -------------------------------------------------------------------------- */
function Sandbox() {
  const [taskIdx, setTaskIdx] = useState(1);
  const [audIdx, setAudIdx] = useState(1);
  const [toneIdx, setToneIdx] = useState(0);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const task = TASKS[taskIdx];
  const audience = AUDIENCES[audIdx];
  const tone = TONES[toneIdx];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const fullText = MOCK_RESPONSES[taskIdx];
    setOutput('');
    setHasRun(true);
    setIsRunning(true);

    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setOutput(fullText.slice(0, i));
      if (i >= fullText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
      }
    }, STREAM_SPEED_MS);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-book-lined bg-book-espresso shadow-book">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-book-lined px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-book-cream/70">
          Try it &middot; build a prompt
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-book-cream/40">
          Preview
        </span>
      </div>

      {/* Builder controls */}
      <div className="space-y-4 p-5">
        <Field label="I want to…">
          <Select
            value={taskIdx}
            onChange={setTaskIdx}
            options={TASKS.map((t) => t.label)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="For…">
            <Select
              value={audIdx}
              onChange={setAudIdx}
              options={AUDIENCES.map((a) => a.label)}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={toneIdx}
              onChange={setToneIdx}
              options={TONES.map((t) => t.label)}
            />
          </Field>
        </div>

        {/* Constructed prompt string */}
        <div className="rounded-lg border border-book-lined bg-black/25 p-3 font-mono text-[13px] leading-relaxed text-book-cream/90">
          <span className="text-book-cream/45">Help me </span>
          <span className="rounded bg-book-terra/25 px-1 text-book-terra">
            {task.value}
          </span>
          <span className="text-book-cream/45"> for </span>
          <span className="rounded bg-book-terra/25 px-1 text-book-terra">
            {audience.value}
          </span>
          <span className="text-book-cream/45">, in a </span>
          <span className="rounded bg-book-terra/25 px-1 text-book-terra">
            {tone.value}
          </span>
          <span className="text-book-cream/45"> tone.</span>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-book-terra px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-book-rose disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Thinking…' : 'See what AI says'}
        </button>

        {/* Mock answer */}
        <div className="paper-scroll h-44 overflow-y-auto rounded-lg border border-book-lined bg-black/20 p-3 font-mono text-[13px] leading-relaxed text-book-cream/85">
          {!hasRun ? (
            <span className="text-book-cream/40">
              Your answer will appear here. This is a gentle preview &mdash; try it.
            </span>
          ) : (
            <span className="whitespace-pre-wrap">
              {output}
              {isRunning && (
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-book-terra" />
              )}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 pt-1">
          <a
            href={AI_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-book-lined px-4 py-2 text-sm font-medium text-book-cream/90 transition hover:border-book-terra/60"
          >
            Try the real thing
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="text-center font-mono text-[10px] uppercase tracking-wider text-book-cream/40">
            The full guide has 120+ ready prompts &amp; a tool picker
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-book-cream/55">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (v: number) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full cursor-pointer rounded-lg border border-book-lined bg-black/20 px-3 py-2 text-sm text-book-cream transition hover:border-book-terra/50 focus:border-book-terra focus:outline-none"
    >
      {options.map((opt, i) => (
        <option key={opt} value={i} className="bg-book-espresso text-book-cream">
          {opt}
        </option>
      ))}
    </select>
  );
}

/* -------------------------------------------------------------------------- */
/*  Everyday — the real tasks you'll actually do (replaces the dev syllabus).   */
/* -------------------------------------------------------------------------- */
const TASK_CARDS = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Explain a confusing letter',
    body: 'Paste a form, a bill, or a letter and get it back in plain English — plus what to do next.',
  },
  {
    icon: <UtensilsCrossed className="h-5 w-5" />,
    title: 'Plan the week’s dinners',
    body: 'Tell it what’s in your kitchen and how much time you have. Get three easy options.',
  },
  {
    icon: <PenLine className="h-5 w-5" />,
    title: 'Write the message you’re dreading',
    body: 'The kind, short note to a teacher, a neighbour, or family — drafted in a few seconds.',
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: 'Compare before you decide',
    body: 'Two strollers, two plans, two options — a clear, calm side-by-side you can trust.',
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: 'Ask it to try again',
    body: 'The first answer is only a draft. Learn the follow-ups that make it genuinely useful.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Stay safe',
    body: 'What to never share, and how to spot a scam text before it fools you.',
  },
];

function Everyday() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-xl">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
          What you&rsquo;ll actually do
        </span>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-book-ink sm:text-[2.75rem]">
          Real tasks from your{' '}
          <span className="italic text-book-terra">actual week.</span>
        </h2>
        <p className="mt-4 text-book-ink/70">
          Not theory. Each one starts with the exact words to type — so the blank
          box stops being scary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TASK_CARDS.map((card) => (
          <div
            key={card.title}
            className="group flex flex-col rounded-2xl border border-book-line bg-book-cream/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-book-terra/50 hover:shadow-book"
          >
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-book-line bg-white/60 text-book-terra">
              {card.icon}
            </span>
            <h3 className="font-serif text-xl text-book-ink">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-book-ink/70">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bundle — the paid product, in the workbook's own warm, editorial look.      */
/* -------------------------------------------------------------------------- */
const BOOK_PARTS: string[] = [
  'Your First Useful Week',
  'Build Better Prompts',
  'Everyday AI Labs',
  'Documents, Images & Voice',
  'Getting Better Answers',
  'Trust, Privacy & Scams',
  'Build Your Personal AI System',
  'The 30-Day Confidence Plan',
];

function Bundle() {
  return (
    <section id="bundle" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-20">
      <div className="overflow-hidden rounded-[1.75rem] bg-book-espresso shadow-book">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
          {/* Left — book identity + offer */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
              The Complete Bundle &middot; AI, Made Friendly
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-book-cream sm:text-5xl">
              Not Behind, Just{' '}
              <span className="italic text-book-terra">Beginning.</span>
            </h2>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-book-cream/70">
              A practical 30-day guide to using AI in everyday life — one useful
              task at a time. The workbook at the heart of the complete bundle.
            </p>

            {/* Format badges */}
            <div className="mt-7 flex flex-wrap gap-3">
              <FormatBadge icon={<BookOpen className="h-4 w-4" />}>
                75-page interactive workbook — saves on your device
              </FormatBadge>
              <FormatBadge icon={<Download className="h-4 w-4" />}>
                Printable PDF edition included
              </FormatBadge>
              <FormatBadge icon={<Check className="h-4 w-4" />}>
                155 parent + 18 caregiver prompts
              </FormatBadge>
            </div>

            {/* Two-sites explainer */}
            <p className="mt-6 max-w-md text-sm leading-relaxed text-book-cream/60">
              Two friendly websites are included: a{' '}
              <strong className="font-semibold text-book-cream/90">
                reference guide
              </strong>{' '}
              to look things up and grab a prompt, and the{' '}
              <strong className="font-semibold text-book-cream/90">
                fillable workbook
              </strong>{' '}
              where you practise and earn your certificate.
            </p>

            {/* Primary CTA */}
            <div className="mt-9">
              <a
                href="/checkout"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-book-terra px-7 py-3.5 text-base font-semibold text-white shadow-terra transition hover:bg-book-rose"
              >
                Get the complete bundle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-sm text-book-cream/55">
                Instant access after checkout &middot; Interactive + printable &middot; Yours to keep
              </p>
              <p className="mt-4 text-sm text-book-cream/70">
                Already a member?{' '}
                <a
                  href={WORKBOOK_URL}
                  className="font-medium text-book-terra underline-offset-4 transition hover:underline"
                >
                  Open your workbook &rarr;
                </a>
              </p>
            </div>
          </div>

          {/* Right — what's inside (the real TOC) */}
          <div className="rounded-2xl border border-book-lined bg-black/20 p-6 sm:p-8">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
              What&rsquo;s inside
            </p>
            <ul className="mt-5 space-y-3">
              {BOOK_PARTS.map((part, i) => (
                <li key={part} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-book-terra">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-snug text-book-cream/85">
                    {part}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-2.5 border-t border-book-lined pt-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-book-terra" />
              <p className="text-sm leading-relaxed text-book-cream/70">
                Plus the{' '}
                <strong className="font-semibold text-book-cream/90">
                  Resource Library
                </strong>{' '}
                — 50 prompts, 25 follow-ups, checklists, and your completion
                certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormatBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-book-lined bg-black/20 px-3.5 py-1.5 text-[13px] font-medium text-book-cream/85">
      <span className="text-book-terra">{icon}</span>
      {children}
    </span>
  );
}
