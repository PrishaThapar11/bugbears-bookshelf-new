import PostCard from './PostCard';

const BOOKS_PER_SHELF = 3;

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

export default function PostShelves({ posts }) {
  return chunk(posts, BOOKS_PER_SHELF).map((row, i) => (
    <div className="flatshelf" key={i}>
      <div className="flatstack">
        {row.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="shelf__plank" />
    </div>
  ));
}