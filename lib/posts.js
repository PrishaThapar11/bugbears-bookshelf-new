import { supabase } from './supabase';

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_on', { ascending: false });

  if (error) {
    console.error('getAllPosts failed:', error.message);
    return [];
  }
  return data;
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('getPostBySlug failed:', error.message);
    return null;
  }
  return data;
}

export async function getFeaturedPost() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('published_on', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getFeaturedPost failed:', error.message);
    return null;
  }
  return data;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Minutes to read, at about 200 words a minute (never less than 1)
export function readingTime(body) {
  const words = String(body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// [{ tag: 'fiction', count: 2 }, ...] most used first
export function tagCounts(posts) {
  const counts = new Map();
  for (const p of posts) {
    for (const t of p.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// tags are stored as 'book-review', shown as 'book review'
export function tagLabel(tag) {
  return String(tag).replace(/-/g, ' ');
}

export async function searchPosts(query) {
  // Strip characters that have special meaning in the database filter syntax
  const q = String(query).replace(/[,()%*\\_"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (q.length < 2) return [];

  const pattern = `*${q}*`;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.${pattern},excerpt.ilike.${pattern},body.ilike.${pattern}`)
    .order('published_on', { ascending: false });

  if (error) {
    console.error('searchPosts failed:', error.message);
    return [];
  }
  return data;
}