import Link from 'next/link';
import { tagLabel } from '../lib/posts';

export default function TagFilter({ tags, active }) {
  if (tags.length === 0) return null;
  return (
    <nav className="tagrow" aria-label="Filter by tag">
      <Link href="/blog" className={`tag${!active ? ' tag--active' : ''}`}>All</Link>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/blog/tag/${tag}`}
          className={`tag${active === tag ? ' tag--active' : ''}`}
        >
          {tagLabel(tag)} <small>{count}</small>
        </Link>
      ))}
    </nav>
  );
}