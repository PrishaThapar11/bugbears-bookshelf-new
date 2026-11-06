import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
  getParagraphs,
} from '../../../lib/posts';
import { getApprovedComments } from '../../../lib/comments';
import CommentForm from '../../../components/CommentForm';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_on,
      images: [post.cover],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const comments = await getApprovedComments(post.id);

  return (
    <div className="has-bg" style={{ '--bg': `url('${post.cover}')` }}>
      <article className="post">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {formatDate(post.published_on)} | By Prisha Thapar | Type: {post.type}
        </p>

        <div className="post__body">
          {getParagraphs(post.body).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <section className="comments">
          <h2>
            {comments.length === 0
              ? 'Comments'
              : `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}
          </h2>

          {comments.map((c) => (
            <div key={c.id} className="comment">
              <p className="comment__name">
                {c.name} <span className="comment__date">· {formatDate(c.created_at)}</span>
              </p>
              <p>{c.body}</p>
            </div>
          ))}

          <h3>Leave a comment</h3>
          <CommentForm postId={post.id} />
        </section>

        <Link href="/blog" className="back-link">← Back to Blogs</Link>
      </article>
    </div>
  );
}