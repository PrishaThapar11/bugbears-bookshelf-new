export default function SearchForm({ defaultValue = '' }) {
  return (
    <form action="/search" className="search-form" role="search">
      <input
        type="search"
        name="q"
        placeholder="Search posts…"
        aria-label="Search posts"
        defaultValue={defaultValue}
        minLength={2}
        required
      />
      <button type="submit" className="btn">Search</button>
    </form>
  );
}