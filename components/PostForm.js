const COVERS = [
  '/images/home.jpg',
  '/images/blog-list.jpg',
  '/images/blog1.jpg',
  '/images/blog2.jpg',
  '/images/blog3.jpg',
  '/images/about.jpg',
  '/images/contact.jpg',
];

const TYPES = ['Book Review', 'Tech', 'Personal Reflection'];

export default function PostForm({ action, post, error, submitLabel }) {
  const p = post ?? {};
  const today = new Date().toISOString().slice(0, 10);
  const covers = p.cover && !COVERS.includes(p.cover) ? [p.cover, ...COVERS] : COVERS;

  return (
    <form action={action}>
      {error && <p className="error-msg">{error}</p>}

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required defaultValue={p.title ?? ''} />
      </div>

      <div className="form-field">
        <label htmlFor="slug">Slug (the web address of the post)</label>
        <input id="slug" name="slug" type="text" defaultValue={p.slug ?? ''} />
        <span className="form-hint">
          Leave empty to create it from the title. Changing it later breaks old links to the post.
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="type">Type</label>
        <input id="type" name="type" type="text" list="types" defaultValue={p.type ?? 'Personal Reflection'} />
        <datalist id="types">
          {TYPES.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div className="form-field">
        <label htmlFor="published_on">Date</label>
        <input id="published_on" name="published_on" type="date" defaultValue={p.published_on ?? today} />
      </div>

      <div className="form-field">
        <label htmlFor="cover">Background image</label>
        <select id="cover" name="cover" defaultValue={p.cover ?? covers[0]}>
          {covers.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="excerpt">Excerpt (shown on cards and link previews)</label>
        <textarea id="excerpt" name="excerpt" rows={4} defaultValue={p.excerpt ?? ''} />
      </div>

      <div className="form-field">
        <label htmlFor="body">Post text</label>
        <textarea id="body" name="body" defaultValue={p.body ?? ''} />
        <span className="form-hint">Leave a blank line between paragraphs.</span>
      </div>

      <div className="form-checks">
        <label>
          <input type="checkbox" name="published" defaultChecked={p.published ?? true} /> Published
        </label>
        <label>
          <input type="checkbox" name="featured" defaultChecked={p.featured ?? false} /> Featured on home page
        </label>
      </div>

      <button type="submit" className="btn">{submitLabel}</button>
    </form>
  );
}