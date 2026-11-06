'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addComment } from '../lib/comment-actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? 'Sending…' : 'Post comment'}
    </button>
  );
}

export default function CommentForm({ postId }) {
  const [state, formAction] = useFormState(addComment, null);

  if (state?.ok) return <p className="comment-note">{state.message}</p>;

  return (
    <form action={formAction} className="comment-form">
      {state && !state.ok && <p className="error-msg">{state.message}</p>}

      <input type="hidden" name="post_id" value={postId} />

      {/* honeypot: hidden from people, bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required maxLength={60} />
      </div>

      <div className="form-field">
        <label htmlFor="comment">Comment</label>
        <textarea id="comment" name="body" required minLength={2} maxLength={2000} />
      </div>

      <SubmitButton />
    </form>
  );
}