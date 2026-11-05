import { redirect } from 'next/navigation';
import { createClient } from './supabase-server';

export const ADMIN_EMAIL = 'prish2900@gmail.com';

// Call this at the top of anything admin-only
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect('/login');
  return { supabase, user };
}