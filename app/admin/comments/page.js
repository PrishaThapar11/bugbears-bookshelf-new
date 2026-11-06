import Link from 'next/link';
import { requireAdmin } from '../../../lib/auth';
import { formatDate } from '../../../lib/posts';
import ConfirmButton from '../../../components/ConfirmButton';
import { approveComment, unapproveComment, deleteComment } from '../actions';

export const metadata = { title: 'Comments' };
export const dynamic = 'force-dynamic';

function CommentRow({ c }) {
  const post = Array.isArray(c.posts) ? c.posts[0] : c.posts;

  return (
    <div className="admin-row">
      <div style={{ flex: '1 1 320px' }}>
        <h2 className="admin-row__title">{c.name}</h2>
        <p className="admin-row__meta">
          {formatDate(c.created_at)} on{' '}
          {post ? <Link href={`/blog/${post.slug}`}>{post.title}</Link> : 'a deleted post'}
        </p>
        <p style={{ whiteSpace: 'pre-line', margin: '8px 0 0' }}>{c.body}</p>
      </div>

      <div className="admin-row__actions">
        {c.approved ? (
          <form action={unapproveComment.bind(null, c.id)}>
            <button type="submit" className="btn btn--small">Hide</button>
          </form>
        ) : (
          <form action={approveComment.bind(null, c.id)}>
            <button type="submit" className="btn btn--small">Show again</button>
          </form>
        )}
        <form action={deleteComment.bind(null, c.id)}>
          <ConfirmButton
            className="btn btn--small btn--danger"
            message="Delete this comment? This can't be undone."
          >
            Delete
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}

export default async function CommentsAdminPage({ searchParams }) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('comments')
    .select('id, name, body, approved, created_at, posts(title, slug)')
    .order('created_at', { ascending: false });

  const comments = data ?? [];
  const live = comments.filter((c) => c.approved);
  const hidden = comments.filter((c) => !c.approved);

  return (
    <>
      <h1 className="admin__title">Comments</h1>
      {(error || searchParams.error) && (
        <p className="error-msg">{error?.message ?? searchParams.error}</p>
      )}

      <h2 className="admin__subtitle">Live on the site ({live.length})</h2>
      {live.length === 0 && <p>No comments yet.</p>}
      {live.map((c) => (
        <CommentRow key={c.id} c={c} />
      ))}

      {hidden.length > 0 && (
        <>
          <h2 className="admin__subtitle">Hidden ({hidden.length})</h2>
          {hidden.map((c) => (
            <CommentRow key={c.id} c={c} />
          ))}
        </>
      )}
    </>
  );
}