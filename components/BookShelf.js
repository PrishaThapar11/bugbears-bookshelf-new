'use client';

import Link from 'next/link';
import { useState } from 'react';

const COVERS = [
  { a: '#5a1328', b: '#34091a' }, // oxblood
  { a: '#2f1b45', b: '#190e28' }, // midnight plum
  { a: '#18403a', b: '#0d2420' }, // bottle green
  { a: '#4f1233', b: '#2e0a1e' }, // wine
  { a: '#42301d', b: '#25190d' }, // old leather
  { a: '#1f2848', b: '#111729' }, // ink blue
];

const BOOKS_PER_SHELF = 6;

// Same title always gives the same colour and size, so the shelf never reshuffles
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

export default function BookShelf({ books }) {
  const [active, setActive] = useState(null);
  const shelves = chunk(books, BOOKS_PER_SHELF);

  return (
    <div className="bookcase">
      {shelves.map((row, i) => (
        <div className="shelf" key={i}>
          <div className="shelf__books">
            {row.map((book) => {
              const h = hash(book.slug);
              const cover = COVERS[h % COVERS.length];
              const height = 250 + ((h >>> 3) % 70);
              const width = 56 + ((h >>> 7) % 24);

              return (
                <Link
                  key={book.slug}
                  href={`/blog/${book.slug}`}
                  className={`book${book.featured ? ' book--featured' : ''}`}
                  style={{
                    '--a': cover.a,
                    '--b': cover.b,
                    '--h': `${height}px`,
                    '--w': `${width}px`,
                  }}
                  aria-label={`${book.title}, ${book.type}`}
                  onMouseEnter={() => setActive(book)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(book)}
                  onBlur={() => setActive(null)}
                >
                  <span className="book__band" />
                  <span className="book__title">{book.title}</span>
                  <span className="book__band" />
                </Link>
              );
            })}
          </div>
          <div className="shelf__plank" />
        </div>
      ))}

      <div className="shelf-caption" aria-live="polite">
        {active ? (
          <>
            <h3>{active.title}</h3>
            <p className="shelf-caption__meta">
              {active.date} · {active.type}
            </p>
            <p>{active.excerpt.length > 170 ? active.excerpt.slice(0, 167) + '…' : active.excerpt}</p>
          </>
        ) : (
          <p className="shelf-caption__hint">Pull a book from the shelf.</p>
        )}
      </div>
    </div>
  );
}