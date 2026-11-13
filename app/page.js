import Link from 'next/link';
import { FaMugHot } from 'react-icons/fa6';
import { getAllPosts, getFeaturedPost, formatDate } from '../lib/posts';
import BookShelf from '../components/BookShelf';

export const revalidate = 60;

const MAX_BOOKS = 12;

export default async function Home() {
  const [featured, all] = await Promise.all([getFeaturedPost(), getAllPosts()]);

  const books = all.slice(0, MAX_BOOKS).map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    excerpt: p.excerpt,
    date: formatDate(p.published_on),
    featured: featured?.id === p.id,
  }));

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/home.jpg')" }}>
      <section className="hero">
        <div>
          <h1>Welcome to Bugbear&apos;s Bookshelf</h1>
          <p className="hero__tagline">
            Happy Reading <FaMugHot />
          </p>

          {featured && (
            <div className="featured">
              <h2>Featured Post: {featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="featured__buttons">
                <Link href={`/blog/${featured.slug}`} className="btn">Read More</Link>
                <Link href="/blog" className="btn">Explore Blogs</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {books.length > 0 && (
        <section className="shelf-section">
          <h2 className="shelf-section__title">The Shelf</h2>
          <BookShelf books={books} />
          {all.length > MAX_BOOKS && (
            <p className="shelf-section__more">
              <Link href="/blog" className="btn">See every book</Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}