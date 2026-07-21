import type { Metadata } from 'next';
import { LegalPage } from '../../components/legal-layout';
import { SUPPORT_EMAIL } from '../../components/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service — Delight Digital',
  description:
    'The simple, plain-English terms for using the Delight Digital site and content.',
};

export default function TermsPage() {
  const email = SUPPORT_EMAIL;

  return (
    <LegalPage
      title="Terms of Service"
      updated="July 21, 2026"
      updatedISO="2026-07-21"
      intro={
        <>
          These terms are the agreement between you and Delight Digital when you
          use our site or buy our content. We&rsquo;ve kept them short and plain.
          Please read them — especially the disclaimer about educational content.
        </>
      }
    >
      <h2>Accepting these terms</h2>
      <p>
        By using this website, signing up for the free guide, or buying the paid
        bundle, you agree to these Terms of Service and to our{' '}
        <a href="/privacy">Privacy Policy</a>. If you don&rsquo;t agree, please
        don&rsquo;t use the site or buy our content.
      </p>

      <h2>What we provide</h2>
      <p>
        Delight Digital creates <strong>educational digital content</strong> for
        beginners who want to start using AI in everyday life. This includes a
        free beginner&rsquo;s guide (our lead magnet) and a paid product,
        &ldquo;AI, Made Friendly — The Complete Bundle,&rdquo; which includes a
        workbook, printable materials, and access to our reference and workbook
        websites.
      </p>

      <h2>How you may use our content</h2>
      <p>
        When you download the free guide or buy the bundle, we grant you a{' '}
        <strong>personal, non-commercial license</strong> to use the materials
        for your own learning. You may not:
      </p>
      <ul>
        <li>Resell, sublicense, rent, or redistribute our files or content.</li>
        <li>
          Share your copy, login, or downloads publicly or with people who
          haven&rsquo;t purchased.
        </li>
        <li>
          Copy our content into your own product, course, or service, or use it
          for commercial purposes, without our written permission.
        </li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The names <strong>&ldquo;Delight Digital,&rdquo;</strong>{' '}
        <strong>&ldquo;AI, Made Friendly,&rdquo;</strong> and{' '}
        <strong>&ldquo;Not Behind, Just Beginning,&rdquo;</strong> along with our
        guides, workbooks, text, designs, and other materials, are our marks and
        content and belong to us. Your license to use them doesn&rsquo;t transfer
        any ownership to you.
      </p>

      <h2>Purchases and payment</h2>
      <p>
        Our paid bundle is sold and delivered through{' '}
        <a href="https://whop.com/" target="_blank" rel="noopener noreferrer">
          Whop
        </a>
        . When you buy, <strong>Whop processes your payment</strong> and{' '}
        <strong>Whop&rsquo;s own terms and policies also apply</strong> to that
        transaction, in addition to these terms. Refunds are handled as described
        in our <a href="/refund">Refund Policy</a>.
      </p>

      <h2>Educational content — not professional advice</h2>
      <p>
        This is important. Our content is <strong>educational only</strong>. It
        is <strong>not</strong> medical, legal, financial, or other professional
        advice, and it&rsquo;s not a substitute for a qualified professional.
      </p>
      <p>
        We teach people how to use AI tools. AI can be{' '}
        <strong>confidently wrong</strong> — it can produce answers that sound
        right but aren&rsquo;t. Always verify anything that matters before you
        rely on it, and consult a suitable professional for medical, legal, or
        financial decisions. <strong>You are always the decision-maker.</strong>
      </p>

      <h2>No guarantee of results</h2>
      <p>
        We share what has worked for us and for beginners, but we can&rsquo;t
        promise any specific outcome or result. What you get from the content
        depends on your own effort, judgment, and circumstances.
      </p>

      <h2>Third-party AI tools</h2>
      <p>
        We refer to and teach the use of third-party AI tools such as ChatGPT,
        Claude, and Gemini. These tools are owned by their respective companies
        and are <strong>not affiliated with, sponsored by, or endorsed by</strong>{' '}
        Delight Digital. Your use of any third-party tool is governed by that
        provider&rsquo;s own terms and privacy policies.
      </p>

      <h2>Provided &ldquo;as is&rdquo;</h2>
      <p>
        Our site and content are provided <strong>&ldquo;as is&rdquo;</strong>{' '}
        and <strong>&ldquo;as available,&rdquo;</strong> without warranties of
        any kind, whether express or implied, to the fullest extent allowed by
        law. We don&rsquo;t warrant that the site will be uninterrupted,
        error-free, or that the content will meet your particular needs.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Delight Digital will not be
        liable for any indirect, incidental, or consequential damages arising
        from your use of the site or content. Where liability cannot be excluded,
        it is limited to the amount you paid us (if anything) for the content in
        question.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the{' '}
        <strong>Commonwealth of Virginia, United States</strong>, without regard
        to its conflict-of-law rules. Any dispute will be handled in the courts
        located in Virginia, to the extent permitted by law.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms from time to time; the &ldquo;Last
        updated&rdquo; date above will reflect the latest version. If you have
        any questions, email us at <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
