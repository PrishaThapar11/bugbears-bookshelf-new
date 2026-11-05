import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
  getParagraphs,
} from '../../../lib/posts';

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

        <Link href="/blog" className="back-link">← Back to Blogs</Link>
      </article>
    </div>
  );
}