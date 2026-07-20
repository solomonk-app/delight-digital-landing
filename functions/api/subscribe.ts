// Cloudflare Pages Function — POST /api/subscribe
// Runs on Cloudflare's edge (NOT via `next dev`). Deployed automatically from the
// project-root /functions directory, alongside the static export in ./out.
// Test locally with: npm run build && npx wrangler pages dev out

interface Env {
  MAILERLITE_API_KEY: string;
  MAILERLITE_GROUP_ID?: string;
}

// Deliberately simple, permissive email check — MailerLite does the real validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.MAILERLITE_API_KEY) {
    // Misconfiguration — don't reveal specifics to the client.
    return json({ ok: false, error: 'Signups are temporarily unavailable.' }, 503);
  }

  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const payload: Record<string, unknown> = { email: email.trim() };
  if (env.MAILERLITE_GROUP_ID) {
    payload.groups = [env.MAILERLITE_GROUP_ID];
  }

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // MailerLite: 201 = created, 200 = already existed/updated. Both are success.
    if (res.ok) {
      return json({ ok: true });
    }

    // Non-2xx: read the body once, log the real reason, map to an honest message.
    const detail = await res.text();
    console.error('MailerLite error', res.status, detail);

    if (res.status === 422) {
      // Validation error. Distinguish a previously-unsubscribed address — which
      // MailerLite refuses to re-import — from a genuinely malformed email, so we
      // never mislabel a valid address as "invalid".
      let message = 'Please check your email address and try again.';
      try {
        const emailErrors = (JSON.parse(detail)?.errors?.email ?? []) as string[];
        if (emailErrors.some((e) => /unsubscrib/i.test(e))) {
          message =
            'That address unsubscribed previously, so it can’t be re-added here. Please use a different email.';
        }
      } catch {
        /* keep the generic validation message */
      }
      return json({ ok: false, error: message }, 400);
    }

    // Any other upstream failure: generic message (already logged above).
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  } catch (err) {
    console.error('MailerLite request failed', err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  }
};
