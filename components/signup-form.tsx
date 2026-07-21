'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Mail, MailCheck, Loader2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  SignupForm — inline email capture, posts to the Cloudflare Function.       */
/*  Shared between the hero and the footer so the two forms never drift.        */
/* -------------------------------------------------------------------------- */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function SignupForm({ id }: { id?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Read the live field value, not just React state: browser autofill and
    // paste can fill the input without firing onChange, which would otherwise
    // leave state empty and submit a blank email.
    const value = (inputRef.current?.value ?? email).trim();
    if (!value) {
      setStatus('error');
      setError('Please enter your email address.');
      return;
    }
    setEmail(value);

    setStatus('submitting');
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
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
        className="flex max-w-md items-start gap-3 rounded-xl border border-book-terra/40 bg-book-terra/10 p-4"
      >
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-book-terra" />
        <div>
          <p className="font-semibold text-book-ink">Check your inbox</p>
          <p className="mt-0.5 text-sm text-book-stone">
            Your free guide is on the way. If you don&rsquo;t see it in a minute,
            have a look in your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="max-w-md" noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-book-stone" />
          <input
            ref={inputRef}
            type="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            autoComplete="email"
            className="w-full rounded-xl border border-book-line bg-white/70 py-3.5 pl-10 pr-4 text-base text-book-ink placeholder:text-book-stone/70 transition focus:border-book-terra focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-book-terra px-6 py-3.5 text-base font-semibold text-white shadow-terra transition hover:bg-book-rose disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending&hellip;
            </>
          ) : (
            <>
              Send me the free guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      {status === 'error' ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm text-book-stone">
          Free &middot; A 16-page beginner&rsquo;s guide &middot; No card &middot; Unsubscribe anytime
        </p>
      )}
      {/* Legal microcopy — shown on every signup form. */}
      <p className="mt-2 text-xs leading-relaxed text-book-stone/80">
        By signing up you agree to our{' '}
        <a
          href="/privacy"
          className="underline underline-offset-2 transition hover:text-book-terra"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="/terms"
          className="underline underline-offset-2 transition hover:text-book-terra"
        >
          Terms
        </a>
        .
      </p>
    </form>
  );
}
