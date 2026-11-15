'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'node:crypto';
import { requireAdmin } from '../../lib/auth';
import { COVERS } from '../../lib/books';

const MAX_TAGS = 8;
const SPINE_KEYS = COVERS.map((c) => c.key);

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function text(formData, name) {
  return String(formData.get(name) ?? '').trim();
}

// "Book Review, fiction ,  re-read" -> ['book-review', 'fiction', 're-read']
function parseTags(raw) {
  const seen = new Set();
  for (const part of String(raw ?? '').split(',')) {
    const t = part
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
    if (t) seen.add(t);
  }
  return [...seen].slice(0, MAX_TAGS);
}

function isFile(v) {
  return v && typeof v === 'object' && typeof v.arrayBuffer === 'function' && v.size > 0;
}

// Tells Next to rebuild the public pages right away
function refresh(slug) {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/blog/tag/[tag]', 'page');
  revalidatePath('/feed.xml');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/blog/${slug}`);
}

function fail(path, message) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

// The browser sends two resized copies: the page background and a 1200x630 link-preview copy
async function uploadCover(supabase, formData, errorPath) {
  const main = formData.get('cover_file');
  const share = formData.get('og_file');
  if (!isFile(main)) return null;

  if (!isFile(share)) fail(errorPath, 'The image upload was incomplete. Please choose the image again.');
  if (main.type !== 'image/jpeg' || share.type !== 'image/jpeg') {
    fail(errorPath, 'Unsupported image type. Please choose a JPG, PNG or WebP image.');
  }
  if (main.size > 3.5 * 1024 * 1024 || share.size > 1024 * 1024) {
    fail(errorPath, 'That image is too large. Please choose a smaller one.');
  }

  const id = randomUUID();
  const files = [
    [`${id}.jpg`, main],
    [`${id}-og.jpg`, share],
  ];

  for (const [path, file] of files) {
    const { error } = await supabase.storage
      .from('covers')
      .upload(path, Buffer.from(await file.arrayBuffer()), {
        contentType: 'image/jpeg',
        upsert: false,
        cacheControl: '31536000',
      });
    if (error) fail(errorPath, `Image upload failed: ${error.message}`);
  }

  return supabase.storage.from('covers').getPublicUrl(`${id}.jpg`).data.publicUrl;
}

async function readForm(formData, supabase, errorPath) {
  const title = text(formData, 'title');
  if (!title) fail(errorPath, 'A title is required.');

  const uploaded = await uploadCover(supabase, formData, errorPath);
  const spine = text(formData, 'spine_color');

  return {
    title,
    slug: slugify(text(formData, 'slug') || title),
    excerpt: text(formData, 'excerpt'),
    body: text(formData, 'body'),
    cover: uploaded ?? (text(formData, 'cover') || '/images/home.jpg'),
    type: text(formData, 'type') || 'Personal Reflection',
    published_on: text(formData, 'published_on') || new Date().toISOString().slice(0, 10),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    tags: parseTags(formData.get('tags')),
    spine_color: SPINE_KEYS.includes(spine) ? spine : null,
  };
}

function saveError(path, error) {
  if (error.code === '23505') fail(path, 'A post with that address (slug) already exists.');
  fail(path, error.message);
}

export async function createPost(formData) {
  const { supabase } = await requireAdmin();
  const post = await readForm(formData, supabase, '/admin/new');
  if (!post.slug) fail('/admin/new', 'A title is required.');

  if (post.featured) {
    await supabase.from('posts').update({ featured: false }).eq('featured', true);
  }

  const { error } = await supabase.from('posts').insert(post);
  if (error) saveError('/admin/new', error);

  refresh(post.slug);
  redirect('/admin');
}

export async function updatePost(id, formData) {
  const { supabase } = await requireAdmin();
  const post = await readForm(formData, supabase, `/admin/${id}`);
  if (!post.slug) fail(`/admin/${id}`, 'A title is required.');

  const { data: old } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();

  if (post.featured) {
    await supabase.from('posts').update({ featured: false }).eq('featured', true).neq('id', id);
  }

  const { error } = await supabase.from('posts').update(post).eq('id', id);
  if (error) saveError(`/admin/${id}`, error);

  refresh(post.slug);
  if (old && old.slug !== post.slug) refresh(old.slug);
  redirect('/admin');
}

export async function deletePost(id) {
  const { supabase } = await requireAdmin();

  const { data: old } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) fail('/admin', error.message);

  refresh(old?.slug);
  redirect('/admin');
}

export async function logout() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function approveComment(id) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('comments')
    .update({ approved: true })
    .eq('id', id)
    .select('posts(slug)')
    .maybeSingle();
  if (error) fail('/admin/comments', error.message);

  const post = Array.isArray(data?.posts) ? data.posts[0] : data?.posts;
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  redirect('/admin/comments');
}

export async function unapproveComment(id) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('comments')
    .update({ approved: false })
    .eq('id', id)
    .select('posts(slug)')
    .maybeSingle();
  if (error) fail('/admin/comments', error.message);

  const post = Array.isArray(data?.posts) ? data.posts[0] : data?.posts;
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  redirect('/admin/comments');
}

export async function deleteComment(id) {
  const { supabase } = await requireAdmin();
  const { data: old } = await supabase
    .from('comments')
    .select('posts(slug)')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) fail('/admin/comments', error.message);

  const post = Array.isArray(old?.posts) ? old.posts[0] : old?.posts;
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  redirect('/admin/comments');
}

const READING_STATUSES = ['reading', 'next', 'finished'];

export async function addReading(formData) {
  const { supabase } = await requireAdmin();
  const title = text(formData, 'title');
  const author = text(formData, 'author');
  const note = text(formData, 'note');
  const requested = text(formData, 'status');
  const status = READING_STATUSES.includes(requested) ? requested : 'reading';

  if (!title) fail('/admin/reading', 'A title is required.');

  const { error } = await supabase.from('reading_list').insert({ title, author, note, status });
  if (error) fail('/admin/reading', error.message);

  revalidatePath('/about');
  redirect('/admin/reading');
}

export async function setReadingStatus(id, status) {
  const { supabase } = await requireAdmin();
  if (!READING_STATUSES.includes(status)) fail('/admin/reading', 'Unknown status.');

  const { error } = await supabase
    .from('reading_list')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) fail('/admin/reading', error.message);

  revalidatePath('/about');
  redirect('/admin/reading');
}

export async function deleteReading(id) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reading_list').delete().eq('id', id);
  if (error) fail('/admin/reading', error.message);

  revalidatePath('/about');
  redirect('/admin/reading');
}