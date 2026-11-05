import Link from 'next/link';
import { formatDate } from '../lib/posts';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-meta">
        {formatDate(post.published_on)} | By Prisha Thapar | Type: {post.type}
      </p>
      <p className="post-card__excerpt">{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="btn">Read More</Link>
    </article>
  );
}