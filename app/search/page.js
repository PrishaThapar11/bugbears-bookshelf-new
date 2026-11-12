import { FaBookOpen } from 'react-icons/fa6';
import { searchPosts } from '../../lib/posts';
import PostCard from '../../components/PostCard';
import SearchForm from '../../components/SearchForm';

export const metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const q = String(searchParams.q ?? '').trim();
  const results = q ? await searchPosts(q) : [];

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/blog-list.jpg')" }}>
      <section className="container">
        <h1 className="page-title">
          <FaBookOpen /> Search
        </h1>

        <SearchForm defaultValue={q} />

        {q && (
          <p className="search-count">
            {results.length === 0
              ? `No posts found for “${q}”.`
              : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”`}
          </p>
        )}

        <div className="post-grid">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}