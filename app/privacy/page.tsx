import type { Metadata } from 'next';
import { LegalPage } from '../../components/legal-layout';
import { SUPPORT_EMAIL } from '../../components/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy — Delight Digital',
  description:
    'How Delight Digital collects, uses, and protects your information, and the choices you have.',
};

export default function PrivacyPage() {
  const email = SUPPORT_EMAIL;

  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 21, 2026"
      updatedISO="2026-07-21"
      intro={
        <>
          This policy explains, in plain English, what information we collect
          when you visit our site or sign up for our free guide, how we use it,
          and the choices you have. We keep this short and honest — no surprises.
        </>
      }
    >
      <h2>Who we are and how to contact us</h2>
      <p>
        This site is run by <strong>Delight Digital</strong>, a small
        educational business that helps beginners start using AI in everyday
        life. We publish a free beginner&rsquo;s guide and sell a paid workbook
        bundle, &ldquo;AI, Made Friendly — The Complete Bundle.&rdquo;
      </p>
      <p>
        If you have any question about this policy or your information, email us
        anytime at{' '}
        <a href={`mailto:${email}`}>{email}</a>. We&rsquo;re happy to help.
      </p>

      <h2>What we collect</h2>
      <p>There are two kinds of information we handle:</p>
      <ul>
        <li>
          <strong>The email address you give us.</strong> When you sign up for
          the free guide, you submit your email address through a form. That
          address is stored with our email provider, MailerLite, so we can send
          you the guide and occasional emails.
        </li>
        <li>
          <strong>Information collected automatically.</strong> Like most
          websites, we and our analytics tools automatically receive some
          technical information when you visit — such as your IP address, device
          and browser type, the pages you view, and how you got here. This is
          gathered through cookies and similar technologies (see{' '}
          <a href="#cookies">Cookies &amp; advertising</a> below).
        </li>
      </ul>
      <p>
        We do not ask for, and this site does not need, sensitive personal
        information. Please don&rsquo;t include anything sensitive in a form
        field or email to us that you wouldn&rsquo;t want stored.
      </p>

      <h2>The services we use, and why</h2>
      <p>
        We rely on a few trusted third-party companies to run the site and
        deliver what you&rsquo;ve asked for. Each one only receives the
        information it needs to do its job:
      </p>
      <ul>
        <li>
          <strong>MailerLite</strong> — stores your email address and sends the
          free guide and our marketing emails. You can unsubscribe at any time.
        </li>
        <li>
          <strong>Whop</strong> — handles the checkout and payment when you buy
          the paid bundle. Whop processes your payment; we never see or store
          your full card details.
        </li>
        <li>
          <strong>Google Analytics 4</strong> — helps us understand how the site
          is used (which pages are visited, roughly where visitors come from) so
          we can improve it.
        </li>
        <li>
          <strong>Google Ads</strong> — measures whether our ads work
          (conversion tracking) and may show you our ads again elsewhere
          (remarketing), using cookies.
        </li>
      </ul>
      <p>
        These companies act as our processors or independent controllers under
        their own privacy policies. We encourage you to review theirs as well.
      </p>

      <h2>Why we use your information</h2>
      <ul>
        <li>To send you the free guide you requested.</li>
        <li>
          To send you marketing and educational emails — which you can{' '}
          <strong>unsubscribe from at any time</strong> using the link in every
          email.
        </li>
        <li>To provide and support the paid bundle if you buy it.</li>
        <li>
          To measure, understand, and improve our site and our advertising.
        </li>
        <li>To keep the site secure and to comply with the law.</li>
      </ul>

      <h2 id="cookies">Cookies &amp; advertising</h2>
      <p>
        Cookies are small files stored by your browser. We use them for basic
        site function, for analytics (to see how the site is used), and for
        advertising and remarketing (so we can measure our ads and, at times,
        show them to you again).
      </p>
      <p>You can opt out of advertising and analytics cookies:</p>
      <ul>
        <li>
          Adjust or block cookies in your <strong>browser settings</strong> —
          every major browser lets you do this.
        </li>
        <li>
          Manage the ads you see through{' '}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&rsquo;s Ad Settings
          </a>{' '}
          and opt out of many advertisers at{' '}
          <a
            href="https://optout.aboutads.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            optout.aboutads.info
          </a>
          .
        </li>
        <li>
          Opt out of Google Analytics across sites with the{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </li>
      </ul>

      <h2>We do not sell your personal data</h2>
      <p>
        We do not sell your personal information, and we do not share it with
        third parties for their own marketing. We only share information with the
        service providers listed above so they can perform their function for us.
      </p>

      <h2>How long we keep your information</h2>
      <p>
        We keep your email address for as long as you&rsquo;re subscribed and for
        a reasonable period afterward, unless you ask us to delete it. If you
        unsubscribe or ask us to remove you, we&rsquo;ll delete or suppress your
        address. Analytics data is retained according to the settings of the
        tools above.
      </p>

      <h2>How we protect your information</h2>
      <p>
        The site is served over HTTPS, and your email address is stored with
        reputable providers that maintain their own security practices. No method
        of transmission or storage is ever completely secure, but we take
        reasonable steps to protect your information and work only with
        established processors.
      </p>

      <h2>Your rights and choices</h2>
      <p>
        Depending on where you live (including under the EU/UK GDPR and
        California&rsquo;s CCPA/CPRA), you may have the right to:
      </p>
      <ul>
        <li>
          <strong>Access</strong> the personal information we hold about you.
        </li>
        <li>
          <strong>Correct</strong> information that&rsquo;s wrong or out of date.
        </li>
        <li>
          <strong>Delete</strong> your information.
        </li>
        <li>
          <strong>Opt out</strong> of marketing emails and of advertising
          cookies (see above).
        </li>
      </ul>
      <p>
        To exercise any of these, just email us at{' '}
        <a href={`mailto:${email}`}>{email}</a> and we&rsquo;ll take care of it.
        You can also unsubscribe from marketing at any time using the link at the
        bottom of every email. We won&rsquo;t treat you differently for
        exercising your rights.
      </p>

      <h2>Children&rsquo;s privacy</h2>
      <p>
        This site is intended for adults and is not directed to children. We do
        not knowingly collect personal information from children. If you believe
        a child has provided us information, please email us and we&rsquo;ll
        delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we&rsquo;ll
        change the &ldquo;Last updated&rdquo; date at the top. If the change is
        significant, we&rsquo;ll do our best to let subscribers know. Continuing
        to use the site after an update means you accept the revised policy.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions, requests, or concerns? Email{' '}
        <a href={`mailto:${email}`}>{email}</a> and a real person will get back
        to you.
      </p>
    </LegalPage>
  );
}
