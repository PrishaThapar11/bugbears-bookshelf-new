'use client';

import Link from 'next/link';
import { useState } from 'react';
import { coverFor, hash } from '../lib/books';
import { useSound } from './SoundProvider';

const BOOKS_PER_SHELF = 6;

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

export default function BookShelf({ books }) {
  const [active, setActive] = useState(null);
  const { play } = useSound();
  const shelves = chunk(books, BOOKS_PER_SHELF);

  function pick(book) {
    setActive(book);
    play('book-slide');
  }

  return (
    <div className="bookcase">
      {shelves.map((row, i) => (
        <div className="shelf" key={i}>
          <div className="shelf__books">
            {row.map((book) => {
              const h = hash(book.slug);
              const cover = coverFor(book.slug);
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
                  onMouseEnter={() => pick(book)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => pick(book)}
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