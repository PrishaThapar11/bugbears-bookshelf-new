import { supabase } from './supabase';

export async function getApprovedComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, name, body, created_at')
    .eq('post_id', postId)
    .eq('approved', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getApprovedComments failed:', error.message);
    return [];
  }
  return data;
}