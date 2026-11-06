'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '../../lib/auth';

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

function readForm(formData) {
  const title = text(formData, 'title');
  return {
    title,
    slug: slugify(text(formData, 'slug') || title),
    excerpt: text(formData, 'excerpt'),
    body: text(formData, 'body'),
    cover: text(formData, 'cover') || '/images/home.jpg',
    type: text(formData, 'type') || 'Personal Reflection',
    published_on: text(formData, 'published_on') || new Date().toISOString().slice(0, 10),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
  };
}

// Tells Next to rebuild these public pages right away
function refresh(slug) {
  revalidatePath('/');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

function fail(path, message) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createPost(formData) {
  const { supabase } = await requireAdmin();
  const post = readForm(formData);
  if (!post.title || !post.slug) fail('/admin/new', 'A title is required.');

  if (post.featured) {
    await supabase.from('posts').update({ featured: false }).eq('featured', true);
  }

  const { error } = await supabase.from('posts').insert(post);
  if (error) fail('/admin/new', error.message);

  refresh(post.slug);
  redirect('/admin');
}

export async function updatePost(id, formData) {
  const { supabase } = await requireAdmin();
  const post = readForm(formData);
  if (!post.title || !post.slug) fail(`/admin/${id}`, 'A title is required.');

  const { data: old } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();

  if (post.featured) {
    await supabase.from('posts').update({ featured: false }).eq('featured', true).neq('id', id);
  }

  const { error } = await supabase.from('posts').update(post).eq('id', id);
  if (error) fail(`/admin/${id}`, error.message);

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