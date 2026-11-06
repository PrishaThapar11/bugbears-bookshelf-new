'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

const THANKS = 'Thank you! Your comment has been posted.';
const LINK_PATTERN = /https?:\/\/|www\./i;

export async function addComment(prevState, formData) {
  // Honeypot: real people never see this field, bots fill it in
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { ok: true, message: THANKS };
  }

  const postId = String(formData.get('post_id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!postId) return { ok: false, message: 'Something went wrong. Please refresh and try again.' };
  if (!name || name.length > 60) return { ok: false, message: 'Please enter a name (up to 60 characters).' };
  if (body.length < 2 || body.length > 2000) {
    return { ok: false, message: 'Comments must be between 2 and 2000 characters.' };
  }
  if (LINK_PATTERN.test(body) || LINK_PATTERN.test(name)) {
    return { ok: false, message: "Sorry, links aren't allowed in comments." };
  }

  const { error } = await supabase
    .from('comments')
    .insert({ post_id: postId, name, body, approved: true });

  if (error) {
    console.error('addComment failed:', error.message);
    return { ok: false, message: 'Could not save your comment. Please try again.' };
  }

  // Look up the slug from the database (not from the form) so the comment shows up right away
  const { data: post } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', postId)
    .maybeSingle();
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);

  return { ok: true, message: THANKS };
}