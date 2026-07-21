import type { Metadata } from 'next';
import { LegalPage } from '../../components/legal-layout';
import { SUPPORT_EMAIL } from '../../components/site-config';

export const metadata: Metadata = {
  title: 'Refund Policy — Delight Digital',
  description:
    'Our simple 7-day refund policy for the AI, Made Friendly bundle.',
};

export default function RefundPage() {
  const email = SUPPORT_EMAIL;

  return (
    <LegalPage
      title="Refund Policy"
      updated="July 21, 2026"
      updatedISO="2026-07-21"
      intro={
        <>
          We want the bundle to genuinely help you. If it&rsquo;s not the right
          fit, we&rsquo;d rather give you your money back than have you keep
          something you won&rsquo;t use. Here&rsquo;s how that works.
        </>
      }
    >
      <h2>Our 7-day refund</h2>
      <p>
        If &ldquo;AI, Made Friendly — The Complete Bundle&rdquo; isn&rsquo;t
        right for you, email us at{' '}
        <a href={`mailto:${email}`}>{email}</a> within{' '}
        <strong>7 days of your purchase</strong> and we&rsquo;ll issue a refund.
        You don&rsquo;t need a complicated reason — just let us know.
      </p>

      <h2>How refunds are processed</h2>
      <p>
        Because your purchase is made through{' '}
        <a href="https://whop.com/" target="_blank" rel="noopener noreferrer">
          Whop
        </a>
        , <strong>refunds are processed through Whop</strong> back to your
        original payment method. Once approved, it can take a few business days
        for the refund to appear, depending on your bank or card provider.
      </p>

      <h2>About digital products</h2>
      <p>
        The bundle is a <strong>digital product</strong> — you get instant access
        to downloadable and online materials after checkout. Our 7-day window
        above is our commitment to you even though the content is delivered
        digitally. If you&rsquo;ve run into a technical problem accessing what you
        bought, please reach out before requesting a refund — most issues are
        quick to fix.
      </p>

      <h2>Any problem, just email us</h2>
      <p>
        If anything about your purchase isn&rsquo;t right — access, files,
        billing, or a refund — email{' '}
        <a href={`mailto:${email}`}>{email}</a> and a real person will help you
        sort it out.
      </p>
    </LegalPage>
  );
}
