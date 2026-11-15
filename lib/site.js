export const SITE_URL = 'https://bugbears-bookshelf-new.vercel.app';
export const SITE_NAME = "Bugbear's Bookshelf";
export const AUTHOR = 'Prisha Thapar';

export function absoluteUrl(u) {
  return String(u).startsWith('http') ? u : `${SITE_URL}${u}`;
}

// '/images/blog1.jpg' -> '/og/blog1.jpg' (the small share version)
// uploaded covers: '.../abc.jpg' -> '.../abc-og.jpg' (made at upload time)
export function ogImage(cover) {
  const c = String(cover);
  if (c.startsWith('http')) return c.replace(/\.jpg$/, '-og.jpg');
  return c.replace('/images/', '/og/').replace(/\.\w+$/, '.jpg');
}

// Previews and search results cut text off around 150 characters
export function shorten(text, max = 155) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}