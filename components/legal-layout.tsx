import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

/* -------------------------------------------------------------------------- */
/*  LegalPage — shared shell for the Privacy / Terms / Refund pages.            */
/*                                                                             */
/*  Content is written as plain semantic HTML (h2, h3, p, ul/li, a, strong)    */
/*  by each page; the `prose` container below styles those descendants with    */
/*  the brand tokens so the three pages stay perfectly consistent.             */
/* -------------------------------------------------------------------------- */

// Arbitrary-variant descendant styling — no typography plugin needed, and it
// keeps each policy file readable as near-plain content.
const prose = [
  'text-base leading-relaxed text-book-ink/80',
  // Section headings
  '[&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-book-ink sm:[&_h2]:text-[1.75rem]',
  '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-book-ink',
  // Body copy
  '[&_p]:mt-4',
  '[&_strong]:font-semibold [&_strong]:text-book-ink',
  // Lists
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-book-terra',
  '[&_li]:pl-1 [&_li]:leading-relaxed',
  // Links
  '[&_a]:font-medium [&_a]:text-book-terra [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-book-terra/40 hover:[&_a]:decoration-book-terra',
].join(' ');

export function LegalPage({
  title,
  updated,
  updatedISO,
  intro,
  children,
}: {
  title: string;
  /** Human-readable date, e.g. "July 21, 2026". */
  updated: string;
  /** Machine-readable date for <time>, e.g. "2026-07-21". */
  updatedISO: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-4 sm:pt-8">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-book-stone transition hover:text-book-terra"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </a>

        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-book-terra">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-book-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-book-stone">
          Last updated:{' '}
          <time dateTime={updatedISO} className="font-medium">
            {updated}
          </time>
        </p>

        <div className="mt-8 border-t border-book-line pt-8">
          <div className={prose}>
            <p className="text-lg text-book-ink/80">{intro}</p>
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
