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

    // 422 = validation error (e.g. malformed email that slipped past our regex).
    if (res.status === 422) {
      return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }

    // Any other upstream failure: log server-side, return a generic message.
    console.error('MailerLite error', res.status, await res.text());
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  } catch (err) {
    console.error('MailerLite request failed', err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  }
};
