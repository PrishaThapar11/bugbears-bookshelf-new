import { getAllPosts } from '../../lib/posts';
import { SITE_URL, SITE_NAME } from '../../lib/site';

export const revalidate = 3600;

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET() {
  const posts = (await getAllPosts()).slice(0, 30);

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.published_on).toUTCString()}</pubDate>
${(p.tags ?? []).map((t) => `      <category>${esc(t)}</category>`).join('\n')}
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const lastBuild = posts[0] ? new Date(posts[0].published_on).toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Book reviews, essays and little life lessons from a cozy corner of the internet.</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}