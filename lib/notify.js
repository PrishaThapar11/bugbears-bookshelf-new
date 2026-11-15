import { SITE_URL } from './site';

export async function notifyNewComment({ postTitle, name, body }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL;
  if (!key || !to) return; // not set up, so skip quietly

  const text = [
    `${name} left a comment on "${postTitle}":`,
    '',
    body.slice(0, 1000),
    '',
    `Moderate: ${SITE_URL}/admin/comments`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: "Bugbear's Bookshelf <onboarding@resend.dev>",
        to: [to],
        subject: `New comment on "${postTitle}"`,
        text, // plain text on purpose, so nothing in a comment can be treated as HTML
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) console.error('notifyNewComment failed:', res.status, await res.text());
  } catch (err) {
    console.error('notifyNewComment error:', err.message);
  }
}