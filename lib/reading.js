import { supabase } from './supabase';

export async function getReading() {
  const { data, error } = await supabase
    .from('reading_list')
    .select('id, title, author, status, note, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getReading failed:', error.message);
    return [];
  }
  return data;
}