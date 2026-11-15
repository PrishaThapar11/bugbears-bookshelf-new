import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, formatDate, readingTime } from '../../../lib/posts';
import { getApprovedComments } from '../../../lib/comments';
import CommentForm from '../../../components/CommentForm';
import Markdown from '../../../components/Markdown';
import TagList from '../../../components/TagList';
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR,
  ogImage,
  absoluteUrl,
  shorten,
} from '../../../lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const description = shorten(post.excerpt);
  const image = ogImage(post.cover);

  return {
    title: post.title,
    description,
    keywords: post.tags?.length ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: post.title,
      description,
      publishedTime: post.published_on,
      authors: [AUTHOR],
      tags: post.tags ?? [],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const comments = await getApprovedComments(post.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: shorten(post.excerpt),
    image: absoluteUrl(ogImage(post.cover)),
    datePublished: post.published_on,
    keywords: (post.tags ?? []).join(', '),
    author: { '@type': 'Person', name: AUTHOR },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="has-bg" style={{ '--bg': `url('${post.cover}')` }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <article className="post">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {formatDate(post.published_on)} | By {AUTHOR} | Type: {post.type} |{' '}
          {readingTime(post.body)} min read
        </p>

        <TagList tags={post.tags} />

        <div className="post__body">
          <Markdown>{post.body}</Markdown>
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