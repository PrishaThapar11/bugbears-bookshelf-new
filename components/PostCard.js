import Link from 'next/link';
import { formatDate, readingTime } from '../lib/posts';
import { coverFor } from '../lib/books';
import FlatBook from './FlatBook';

export default function PostCard({ post }) {
  const { a, b, offset } = coverFor(post.slug, post.spine_color);

  return (
    <FlatBook style={{ '--a': a, '--b': b, '--off': `${offset}px` }}>
      <span className="flatbook__spine" aria-hidden="true" />
      <div className="post-card flatbook__cover">
        <h2 className="post-card__title">{post.title}</h2>
        <p className="post-meta">
          {formatDate(post.published_on)} | By Prisha Thapar | Type: {post.type} |{' '}
          {readingTime(post.body)} min read
        </p>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="btn">Read More</Link>
      </div>
    </FlatBook>
  );
}