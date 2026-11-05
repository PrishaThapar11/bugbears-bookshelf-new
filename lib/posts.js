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

// Body text is stored with a blank line between paragraphs
export function getParagraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}