export const SITE_URL = 'https://bugbears-bookshelf-new.vercel.app';
export const SITE_NAME = "Bugbear's Bookshelf";
export const AUTHOR = 'Prisha Thapar';

// '/images/blog1.jpg' -> '/og/blog1.jpg' (the small version made for link previews)
export function ogImage(cover) {
  return String(cover).replace('/images/', '/og/').replace(/\.\w+$/, '.jpg');
}

// Previews and search results cut text off around 150 characters
export function shorten(text, max = 155) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}