import { FaFeatherPointed } from 'react-icons/fa6';
import { getAllPosts, tagCounts } from '../../lib/posts';
import PostShelves from '../../components/PostShelves';
import SearchForm from '../../components/SearchForm';
import TagFilter from '../../components/TagFilter';

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
        <TagFilter tags={tagCounts(posts)} active={null} />

        <PostShelves posts={posts} />
      </section>
    </div>
  );
}