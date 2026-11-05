import Link from 'next/link';
import { FaMugHot } from 'react-icons/fa6';
import { getFeaturedPost } from '../lib/posts';

export default function Home() {
  const post = getFeaturedPost();

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/home.jpg')" }}>
      <section className="hero">
        <div>
          <h1>Welcome to Bugbear&apos;s Bookshelf</h1>
          <p className="hero__tagline">
            Happy Reading <FaMugHot />
          </p>

          <div className="featured">
            <h2>Featured Post: {post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="featured__buttons">
              <Link href={`/blog/${post.slug}`} className="btn">Read More</Link>
              <Link href="/blog" className="btn">Explore Blogs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}