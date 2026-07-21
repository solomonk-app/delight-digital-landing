import { SignupForm } from './signup-form';
import { SUPPORT_EMAIL } from './site-config';

/* -------------------------------------------------------------------------- */
/*  SiteFooter — shared across the homepage and the legal pages. Keeps the warm */
/*  closing CTA, then a bottom bar with contact + the legal links.              */
/*  showCta={false} hides the "Start with one useful task" signup block (used   */
/*  on /thank-you); the legal bottom bar always stays.                          */
/* -------------------------------------------------------------------------- */
export function SiteFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer className="border-t border-book-line">
      {showCta && (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="max-w-xl font-serif text-3xl leading-tight tracking-tight text-book-ink sm:text-4xl">
            Start with one useful task.
          </h2>
          <div className="w-full max-w-md text-left">
            <SignupForm />
          </div>
          <p className="text-sm text-book-stone">
            Ready for the full workbook?{' '}
            <a
              href="/checkout"
              className="font-medium text-book-terra underline-offset-4 transition hover:underline"
            >
              Get the complete bundle &rarr;
            </a>
          </p>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-book-stone">
            Delight Digital is an educational guide. AI can be confidently wrong —
            always double-check anything important. Not medical, legal, or
            financial advice.
          </p>
          <p className="text-xs text-book-stone/80">
            You&rsquo;re not behind — you&rsquo;re just beginning.
          </p>
        </div>
      )}

      {/* Bottom bar — contact + legal links. Works on every page. The top
          separator is only needed when the CTA sits above it. */}
      <div className={showCta ? 'border-t border-book-line' : ''}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-sm text-book-stone sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Delight Digital &middot;{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="underline-offset-4 transition hover:text-book-terra hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            <a
              href="/privacy"
              className="underline-offset-4 transition hover:text-book-terra hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="underline-offset-4 transition hover:text-book-terra hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="/refund"
              className="underline-offset-4 transition hover:text-book-terra hover:underline"
            >
              Refund Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
