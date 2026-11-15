import { notFound } from 'next/navigation';
import { FaFeatherPointed } from 'react-icons/fa6';
import { getAllPosts, tagCounts, tagLabel } from '../../../../lib/posts';
import PostShelves from '../../../../components/PostShelves';
import SearchForm from '../../../../components/SearchForm';
import TagFilter from '../../../../components/TagFilter';

export const revalidate = 60;

function clean(raw) {
  try {
    return decodeURIComponent(raw).toLowerCase();
  } catch {
    return '';
  }
}

export function generateMetadata({ params }) {
  const tag = clean(params.tag);
  return {
    title: `Posts tagged “${tagLabel(tag)}”`,
    description: `Everything on Bugbear's Bookshelf tagged ${tagLabel(tag)}.`,
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function TagPage({ params }) {
  const tag = clean(params.tag);
  const all = await getAllPosts();
  const posts = all.filter((p) => (p.tags ?? []).includes(tag));
  if (posts.length === 0) notFound();

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/blog-list.jpg')" }}>
      <section className="container">
        <h1 className="page-title">
          <FaFeatherPointed /> {tagLabel(tag)} <FaFeatherPointed />
        </h1>

        <SearchForm />
        <TagFilter tags={tagCounts(all)} active={tag} />

        <PostShelves posts={posts} />
      </section>
    </div>
  );
}