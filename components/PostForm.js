'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { COVERS } from '../lib/books';
import Markdown from './Markdown';
import CoverUploader from './CoverUploader';

const IMAGES = [
  '/images/home.jpg',
  '/images/blog-list.jpg',
  '/images/blog1.jpg',
  '/images/blog2.jpg',
  '/images/blog3.jpg',
  '/images/about.jpg',
  '/images/contact.jpg',
];

const TYPES = ['Book Review', 'Tech', 'Personal Reflection'];

function SubmitButton({ label, busy }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending || busy}>
      {pending ? 'Saving…' : busy ? 'Preparing image…' : label}
    </button>
  );
}

export default function PostForm({ action, post, error, submitLabel }) {
  const p = post ?? {};
  const today = new Date().toISOString().slice(0, 10);
  const covers = p.cover && !IMAGES.includes(p.cover) ? [p.cover, ...IMAGES] : IMAGES;

  const [body, setBody] = useState(p.body ?? '');
  const [tab, setTab] = useState('write');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);

  // wrap the selected text, like **bold**
  function surround(before, after, placeholder) {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const chosen = body.slice(s, e) || placeholder;
    setBody(body.slice(0, s) + before + chosen + after + body.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + chosen.length);
    });
  }

  // add a prefix to every selected line, like "> " for a quote
  function prefixLines(prefix) {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const from = body.lastIndexOf('\n', s - 1) + 1;
    let to = body.indexOf('\n', e);
    if (to === -1) to = body.length;
    const block = body
      .slice(from, to)
      .split('\n')
      .map((line) => prefix + line)
      .join('\n');
    setBody(body.slice(0, from) + block + body.slice(to));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, from + block.length);
    });
  }

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
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="fiction, classics, re-read"
          defaultValue={(p.tags ?? []).join(', ')}
        />
        <span className="form-hint">
          Separate with commas. Up to 8 tags, letters and numbers only. These power the filter on the blog page.
        </span>
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
              {c.startsWith('http') ? 'Uploaded image (current)' : c}
            </option>
          ))}
        </select>
        <CoverUploader onBusy={setBusy} />
      </div>

      <div className="form-field">
        <label>Spine colour (the book on the shelf)</label>
        <div className="swatches" role="radiogroup" aria-label="Spine colour">
          <label className="swatch swatch--auto" title="Automatic">
            <input type="radio" name="spine_color" value="" defaultChecked={!p.spine_color} />
            <span>Auto</span>
          </label>
          {COVERS.map((c) => (
            <label className="swatch" key={c.key} title={c.name}>
              <input
                type="radio"
                name="spine_color"
                value={c.key}
                defaultChecked={p.spine_color === c.key}
              />
              <span style={{ background: `linear-gradient(90deg, ${c.b}, ${c.a} 45%, ${c.b})` }} />
            </label>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="excerpt">Excerpt (shown on cards and link previews)</label>
        <textarea id="excerpt" name="excerpt" rows={4} defaultValue={p.excerpt ?? ''} />
      </div>

      <div className="form-field">
        <label htmlFor="body">Post text</label>

        <div className="md-bar">
          <div className="md-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'write'}
              className={tab === 'write' ? 'is-on' : ''}
              onClick={() => setTab('write')}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'preview'}
              className={tab === 'preview' ? 'is-on' : ''}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
          </div>

          {tab === 'write' && (
            <div className="md-tools">
              <button type="button" title="Bold" onClick={() => surround('**', '**', 'bold text')}><b>B</b></button>
              <button type="button" title="Italic" onClick={() => surround('*', '*', 'italic text')}><i>I</i></button>
              <button type="button" title="Heading" onClick={() => prefixLines('## ')}>H</button>
              <button type="button" title="Quote" onClick={() => prefixLines('> ')}>&ldquo;</button>
              <button type="button" title="List" onClick={() => prefixLines('- ')}>•</button>
              <button type="button" title="Link" onClick={() => surround('[', '](https://)', 'link text')}>Link</button>
            </div>
          )}
        </div>

        {/* the textarea has no name, the hidden input below is what gets saved */}
        <textarea
          id="body"
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ display: tab === 'write' ? 'block' : 'none' }}
        />
        <input type="hidden" name="body" value={body} />

        {tab === 'write' ? (
          <span className="form-hint">
            *italic* · **bold** · ## heading · &gt; quote · - list · blank line = new paragraph · Enter = line break
          </span>
        ) : (
          <div className="post md-preview">
            <div className="post__body">
              {body.trim() ? <Markdown>{body}</Markdown> : <p>Nothing to preview yet.</p>}
            </div>
          </div>
        )}
      </div>

      <div className="form-checks">
        <label>
          <input type="checkbox" name="published" defaultChecked={p.published ?? true} /> Published
        </label>
        <label>
          <input type="checkbox" name="featured" defaultChecked={p.featured ?? false} /> Featured on home page
        </label>
      </div>

      <SubmitButton label={submitLabel} busy={busy} />
    </form>
  );
}