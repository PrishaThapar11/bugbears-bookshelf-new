import Link from 'next/link';
import { requireAdmin } from '../../lib/auth';
import { formatDate } from '../../lib/posts';
import ConfirmButton from '../../components/ConfirmButton';
import { deletePost } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }) {
  const { supabase } = await requireAdmin();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, title, published, featured, published_on')
    .order('published_on', { ascending: false });

  return (
    <>
      <h1 className="admin__title">All posts</h1>
      {(error || searchParams.error) && (
        <p className="error-msg">{error?.message ?? searchParams.error}</p>
      )}

      {(posts ?? []).map((post) => (
        <div key={post.id} className="admin-row">
          <div>
            <h2 className="admin-row__title">{post.title}</h2>
            <p className="admin-row__meta">
              {!post.published && <span className="badge">Draft</span>}
              {post.featured && <span className="badge">Featured</span>}
              {formatDate(post.published_on)}
            </p>
          </div>

          <div className="admin-row__actions">
            {post.published && (
              <Link href={`/blog/${post.slug}`} className="btn btn--small">View</Link>
            )}
            <Link href={`/admin/${post.id}`} className="btn btn--small">Edit</Link>
            <form action={deletePost.bind(null, post.id)}>
              <ConfirmButton
                className="btn btn--small btn--danger"
                message={`Delete "${post.title}"? This can't be undone.`}
              >
                Delete
              </ConfirmButton>
            </form>
          </div>
        </div>
      ))}
    </>
  );
}