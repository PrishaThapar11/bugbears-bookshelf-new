import { FaFeatherPointed } from 'react-icons/fa6';
import { getAllPosts } from '../../lib/posts';
import PostCard from '../../components/PostCard';
import SearchForm from '../../components/SearchForm';

export const revalidate = 60;

export const metadata = {
  title: 'Blogs',
  description: 'Recent reads and ramblings: book reviews, tech musings and personal reflections.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/blog-list.jpg')" }}>
      <section className="container">
        <h1 className="page-title">
          <FaFeatherPointed /> Recent Reads and Ramblings <FaFeatherPointed />
        </h1>

        <SearchForm />

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}