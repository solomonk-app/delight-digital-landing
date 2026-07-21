import { Sparkles } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  SiteHeader — shared top nav. Brand links home; section links point at the   */
/*  homepage anchors so they resolve from any route (incl. the legal pages).    */
/* -------------------------------------------------------------------------- */
export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a
        href="/"
        className="flex items-center gap-2.5 rounded-lg"
        aria-label="Delight Digital — home"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-book-terra">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.2} />
        </span>
        <span className="font-serif text-lg tracking-tight text-book-ink">
          Delight Digital
        </span>
      </a>
      <div className="flex items-center gap-2.5">
        <a
          href="/#bundle"
          className="hidden items-center rounded-lg border border-book-line px-4 py-2 text-sm font-medium text-book-ink transition hover:border-book-terra/60 sm:inline-flex"
        >
          The bundle
        </a>
        <a
          href="/#get-guide"
          className="rounded-lg bg-book-espresso px-4 py-2 text-sm font-semibold text-book-cream transition hover:bg-book-ink"
        >
          Free guide
        </a>
      </div>
    </header>
  );
}
