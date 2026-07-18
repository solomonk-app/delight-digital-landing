'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Play,
  Quote,
  BrainCircuit,
  Image as ImageIcon,
  Workflow,
  Mail,
  MailCheck,
  ShieldCheck,
  Loader2,
  BookOpen,
  Download,
  Check,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                      */
/* -------------------------------------------------------------------------- */
// The existing interactive AI app that this landing page hands off to.
const AI_APP_URL = 'https://ai.delightdigital.online';

// Paid product: the public Whop sales/checkout page for
// "AI, Made Friendly: The Complete Bundle" (anonymous visitors can buy here).
const WHOP_CHECKOUT_URL =
  'https://whop.com/joined/delightdigital/products/ai-made-friendly-the-complete-bundle/';

// Buyer-only workbook, gated by a Whop entitlement check (see the delight-workbook
// Cloudflare Pages project). Members land here after purchase.
const WORKBOOK_URL = 'https://workbook.delightdigital.online';

/* -------------------------------------------------------------------------- */
/*  Sandbox data — the fill-in-the-blank prompt builder.                       */
/* -------------------------------------------------------------------------- */
const TASKS = [
  { value: 'a cold outreach email', label: 'Cold outreach email' },
  { value: 'a LinkedIn hook', label: 'LinkedIn hook' },
  { value: 'a product description', label: 'Product description' },
] as const;

const TONES = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'witty', label: 'Witty' },
] as const;

// Three hardcoded mock "AI" responses — one per task. No API calls.
const MOCK_RESPONSES: string[] = [
  "Subject: A quick idea for your team\n\nHi Jordan,\n\nNoticed your team just shipped the new onboarding flow — clean work. I help ops folks reclaim ~5 hours a week by automating the repetitive bits (inbox triage, follow-ups, data entry).\n\nWorth a 15-minute look? I'll bring one automation you can keep, free.\n\n— Sam",
  "Everyone says \"AI will take your job.\"\n\nWrong.\n\nA person who knows how to *ask* AI will take your job.\n\nHere's the 3-line prompt I use to draft a week of content in 10 minutes 👇",
  "Meet FocusDesk — the standing desk that remembers you.\n\nIt learns your sit/stand rhythm, nudges you before the slump hits, and syncs your posture data to your calendar. Less back pain, more deep work. Assembled in under 10 minutes, no tools, no manual.",
];

const STREAM_SPEED_MS = 16;

/* -------------------------------------------------------------------------- */
/*  SignupForm — inline email capture, posts to the Cloudflare Function.       */
/* -------------------------------------------------------------------------- */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function SignupForm({ id }: { id?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        id={id}
        className="flex max-w-md items-start gap-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-4"
      >
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-cyan" />
        <div>
          <p className="font-semibold text-white">Check your inbox</p>
          <p className="mt-0.5 text-sm text-slate-400">
            Your free guide is on the way. If you don&rsquo;t see it in a minute,
            check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="max-w-md" noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            autoComplete="email"
            className="w-full rounded-xl border border-ink-700 bg-ink-900/70 py-3.5 pl-10 pr-4 text-base text-slate-100 placeholder:text-slate-600 transition focus:border-accent-violet focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Get the Free Guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      {status === 'error' ? (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          Free · Instant access · No card · Unsubscribe anytime
        </p>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Faint blueprint grid — evokes a dev tool without shouting. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-faint bg-[size:44px_44px] opacity-40"
      />
      <Nav />
      <Hero />
      <Syllabus />
      <BundleUpsell />
      <Footer />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                         */
/* -------------------------------------------------------------------------- */
function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet shadow-glow">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.2} />
        </span>
        <span className="text-sm font-semibold tracking-tight text-slate-100">
          Delight Digital
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <a
          href="#bundle"
          className="hidden items-center rounded-lg bg-book-terra px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-book-rose hover:text-white sm:inline-flex"
        >
          The paid bundle
        </a>
        <a
          href="#get-guide"
          className="rounded-lg border border-ink-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-accent-violet/60 hover:text-white"
        >
          Get the guide
        </a>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero — headline + CTA on the left, live sandbox on the right.              */
/* -------------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-8 pt-10 lg:grid-cols-2 lg:items-center lg:pt-16">
      {/* Left column */}
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          The AI Beginner&rsquo;s Guide
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
          Stop guessing prompts.{' '}
          <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan bg-clip-text text-transparent">
            Master AI interactively
          </span>{' '}
          with Delight Digital.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
          Zero technical experience needed. No jargon, no setup, no code — just a
          hands-on guide that teaches you to get real work done with AI by doing
          it, not reading about it.
        </p>

        <div className="mt-9">
          <SignupForm id="get-guide" />
        </div>

        <Testimonial />
      </div>

      {/* Right column — the signature interactive sandbox */}
      <div className="animate-fade-up [animation-delay:120ms]">
        <Sandbox />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonial (social proof, directly under the hero copy / beside sandbox)  */
/* -------------------------------------------------------------------------- */
function Testimonial() {
  return (
    <figure className="mt-10 max-w-lg rounded-2xl border border-ink-700 bg-ink-900/50 p-5">
      <Quote className="h-5 w-5 text-accent-violet" />
      <blockquote className="mt-3 text-sm leading-relaxed text-slate-300">
        &ldquo;I thought AI was only for software engineers. The Delight Digital
        guide helped me automate my daily email sorting in 20 minutes.&rdquo;
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-[10px] font-semibold text-white">
          M
        </span>
        Maya R. · Operations Lead
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sandbox — a mock code editor that builds a prompt and "streams" output.    */
/* -------------------------------------------------------------------------- */
function Sandbox() {
  const [taskIdx, setTaskIdx] = useState(0);
  const [toneIdx, setToneIdx] = useState(1);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const task = TASKS[taskIdx];
  const tone = TONES[toneIdx];
  const prompt = `Write ${task.value} in a ${tone.value} tone.`;

  // Clean up any running stream if the component unmounts.
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
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/80 shadow-glow backdrop-blur">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-800/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-green-400/70" />
        <span className="ml-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Terminal className="h-3.5 w-3.5" />
          prompt-sandbox
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-slate-600">
          Live demo
        </span>
      </div>

      {/* Builder controls */}
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Task">
            <Select
              value={taskIdx}
              onChange={(v) => setTaskIdx(v)}
              options={TASKS.map((t) => t.label)}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={toneIdx}
              onChange={(v) => setToneIdx(v)}
              options={TONES.map((t) => t.label)}
            />
          </Field>
        </div>

        {/* Constructed prompt string */}
        <div className="rounded-lg border border-ink-700 bg-ink-950/70 p-3 font-mono text-[13px] leading-relaxed">
          <span className="text-slate-600">&gt; </span>
          <span className="text-slate-300">Write </span>
          <span className="rounded bg-accent-blue/15 px-1 text-accent-cyan">
            {task.value}
          </span>
          <span className="text-slate-300"> in a </span>
          <span className="rounded bg-accent-violet/15 px-1 text-accent-violet">
            {tone.value}
          </span>
          <span className="text-slate-300"> tone.</span>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running…' : 'Run Simulation'}
        </button>

        {/* Mock terminal output */}
        <div className="terminal-scroll h-44 overflow-y-auto rounded-lg border border-ink-700 bg-ink-950/80 p-3 font-mono text-[13px] leading-relaxed text-slate-300">
          {!hasRun ? (
            <span className="text-slate-600">
              // Output will stream here when you run the simulation.
            </span>
          ) : (
            <span className="whitespace-pre-wrap">
              {output}
              {isRunning && (
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent-cyan" />
              )}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 pt-1">
          <a
            href={AI_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-800/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-accent-violet/60 hover:text-white"
          >
            Try the real AI sandbox
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="text-center text-[11px] text-slate-600">
            This preview is simulated — the live tool runs at ai.delightdigital.online
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
      <span className="mb-1.5 block text-xs font-medium text-slate-500">
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
      className="w-full cursor-pointer rounded-lg border border-ink-700 bg-ink-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-accent-violet/50 focus:border-accent-violet focus:outline-none"
    >
      {options.map((opt, i) => (
        <option key={opt} value={i} className="bg-ink-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

/* -------------------------------------------------------------------------- */
/*  Syllabus — bento grid of the curriculum.                                   */
/* -------------------------------------------------------------------------- */
function Syllabus() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What you&rsquo;ll actually learn
        </h2>
        <p className="mt-3 text-slate-400">
          Built around real tasks, not theory. Each module ends with something
          you can use the same day.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Large hero card */}
        <BentoCard
          className="sm:col-span-2 lg:row-span-2"
          icon={<BrainCircuit className="h-6 w-6" />}
          title="Prompt Engineering 101"
          featured
        >
          The core skill. Learn the anatomy of a great prompt — context, role,
          constraints, and examples — and the fill-in-the-blank framework you saw
          in the sandbox. Go from vague requests to reliable, repeatable results.
        </BentoCard>

        <BentoCard
          icon={<ImageIcon className="h-6 w-6" />}
          title="Image Generation"
        >
          Turn a sentence into a usable image. Styles, aspect ratios, and the
          words that actually change the output.
        </BentoCard>

        <BentoCard icon={<Workflow className="h-6 w-6" />} title="Automation">
          Chain simple steps to handle repetitive work while you focus on the
          parts only you can do.
        </BentoCard>

        <BentoCard icon={<Mail className="h-6 w-6" />} title="AI for Your Inbox">
          Sort, summarize, and draft replies — the 20-minute setup from the
          testimonial, step by step.
        </BentoCard>

        <BentoCard
          className="sm:col-span-2 lg:col-span-1"
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Using AI Responsibly"
        >
          Spot hallucinations, protect private data, and know when to trust the
          output — and when not to.
        </BentoCard>
      </div>
    </section>
  );
}

function BentoCard({
  icon,
  title,
  children,
  className = '',
  featured = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`group flex flex-col rounded-2xl border border-ink-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-violet/60 hover:shadow-glow ${
        featured
          ? 'bg-gradient-to-br from-ink-800/80 to-ink-900/80'
          : 'bg-ink-900/50'
      } ${className}`}
    >
      <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-ink-700 bg-ink-950/60 text-accent-cyan transition-colors group-hover:text-accent-violet">
        {icon}
      </span>
      <h3
        className={`font-semibold text-white ${
          featured ? 'text-2xl' : 'text-lg'
        }`}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BundleUpsell — the paid product. A warm, editorial "book" panel that        */
/*  bridges into the dark page and previews what buyers actually receive.       */
/* -------------------------------------------------------------------------- */

// The workbook's real table of contents (8 parts) — the paid analog of the free
// Syllabus above.
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

function BundleUpsell() {
  return (
    <section id="bundle" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-20">
      <div className="overflow-hidden rounded-[1.75rem] border border-ink-700 bg-gradient-to-br from-ink-800/70 to-ink-900/80 shadow-glow">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
          {/* Left — book identity + offer */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
              The paid upgrade · AI, Made Friendly
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
              Not Behind, Just{' '}
              <span className="italic text-book-terra">Beginning.</span>
            </h2>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-400">
              A practical 30-day guide to using AI in everyday life — one useful
              task at a time. The full workbook at the heart of the Complete
              Bundle.
            </p>

            {/* Format badges */}
            <div className="mt-7 flex flex-wrap gap-3">
              <FormatBadge icon={<BookOpen className="h-4 w-4" />}>
                75-page interactive workbook — saves as you go
              </FormatBadge>
              <FormatBadge icon={<Download className="h-4 w-4" />}>
                Printable PDF edition included
              </FormatBadge>
            </div>

            {/* Primary CTA */}
            <div className="mt-9">
              <a
                href={WHOP_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-book-terra px-7 py-3.5 text-base font-semibold text-ink-950 shadow-[0_14px_30px_-12px_rgba(201,122,87,0.9)] transition hover:bg-book-rose hover:text-white"
              >
                Get the Complete Bundle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-sm text-slate-500">
                Instant access after checkout · Interactive + PDF · Yours to keep
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Already a member?{' '}
                <a
                  href={WORKBOOK_URL}
                  className="font-medium text-book-terra underline-offset-4 transition hover:underline"
                >
                  Open your workbook →
                </a>
              </p>
            </div>
          </div>

          {/* Right — what's inside (the real TOC) */}
          <div className="rounded-2xl border border-ink-700 bg-ink-950/40 p-6 sm:p-8">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
              What&rsquo;s inside
            </p>
            <ul className="mt-5 space-y-3">
              {BOOK_PARTS.map((part, i) => (
                <li key={part} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-book-terra">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-snug text-slate-300">
                    {part}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-2.5 border-t border-ink-700 pt-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-book-terra" />
              <p className="text-sm leading-relaxed text-slate-400">
                Plus the{' '}
                <strong className="font-semibold text-slate-200">
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
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-950/60 px-3.5 py-1.5 text-[13px] font-medium text-slate-300">
      <span className="text-book-terra">{icon}</span>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                      */
/* -------------------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ready to stop guessing?
        </h2>
        <div className="w-full max-w-md text-left">
          <SignupForm />
        </div>
        <p className="text-sm text-slate-500">
          Ready for the full workbook?{' '}
          <a
            href={WHOP_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-book-terra underline-offset-4 transition hover:underline"
          >
            Get the Complete Bundle →
          </a>
        </p>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Delight Digital. Learn AI by doing.
        </p>
      </div>
    </footer>
  );
}
