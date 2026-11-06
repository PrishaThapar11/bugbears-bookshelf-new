import Link from 'next/link';
import { requireAdmin } from '../../lib/auth';
import { logout } from './actions';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const { supabase } = await requireAdmin();

  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  return (
    <div className="admin">
      <div className="admin__inner">
        <div className="admin__bar">
          <nav className="admin__nav">
            <Link href="/admin">All posts</Link>
            <Link href="/admin/new">+ New post</Link>
            <Link href="/admin/comments">
              Comments{count ? ` (${count} in last 3 days)` : ''}
            </Link>
            <Link href="/">View site</Link>
          </nav>
          <form action={logout}>
            <button type="submit" className="btn btn--small">Log out</button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}