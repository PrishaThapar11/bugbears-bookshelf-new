import Link from 'next/link';
import { tagLabel } from '../lib/posts';

export default function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="taglist" aria-label="Tags">
      {tags.map((t) => (
        <li key={t}>
          <Link href={`/blog/tag/${t}`} className="tag">#{tagLabel(t)}</Link>
        </li>
      ))}
    </ul>
  );
}