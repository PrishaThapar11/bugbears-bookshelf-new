import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, formatDate } from '../../../lib/posts';

// Tells Next which pages to build ahead of time
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// Per-post <title>, description and link preview (this is your SEO base)
export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [post.cover],
    },
  };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="has-bg" style={{ '--bg': `url('${post.cover}')` }}>
      <article className="post">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {formatDate(post.date)} | By Prisha Thapar | Type: {post.type}
        </p>

        <div className="post__body">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <Link href="/blog" className="back-link">← Back to Blogs</Link>
      </article>
    </div>
  );
}