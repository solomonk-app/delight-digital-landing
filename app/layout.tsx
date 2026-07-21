import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { GoogleTag } from '../components/google-tag';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Editorial display face for the paid-book upsell panel (matches the workbook itself).
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Delight Digital — AI, Made Friendly',
  description:
    'A calm, beginner-friendly way to start using AI in everyday life — one useful task at a time. No coding, no jargon, no feeling behind.',
  openGraph: {
    title: 'Delight Digital — AI, Made Friendly',
    description:
      "You're not behind. You're just beginning. A gentle, practical guide to using AI for real, everyday tasks.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        {/* Site-wide Google tag (gtag.js) — loads once, on every page. */}
        <GoogleTag />
      </head>
      <body>{children}</body>
    </html>
  );
}
