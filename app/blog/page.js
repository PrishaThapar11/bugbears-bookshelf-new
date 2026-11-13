import { FaFeatherPointed } from 'react-icons/fa6';
import { getAllPosts } from '../../lib/posts';
import PostCard from '../../components/PostCard';
import SearchForm from '../../components/SearchForm';

export const revalidate = 60;

export const metadata = {
  title: 'Blogs',
  description: 'Recent reads and ramblings: book reviews, tech musings and personal reflections.',
};

const BOOKS_PER_SHELF = 3;

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const shelves = chunk(posts, BOOKS_PER_SHELF);

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/blog-list.jpg')" }}>
      <section className="container">
        <h1 className="page-title">
          <FaFeatherPointed /> Recent Reads and Ramblings <FaFeatherPointed />
        </h1>

        <SearchForm />

        {shelves.map((row, i) => (
          <div className="flatshelf" key={i}>
            <div className="flatstack">
              {row.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="shelf__plank" />
          </div>
        ))}
      </section>
    </div>
  );
}