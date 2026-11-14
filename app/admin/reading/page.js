import { requireAdmin } from '../../../lib/auth';
import ConfirmButton from '../../../components/ConfirmButton';
import { addReading, setReadingStatus, deleteReading } from '../actions';

export const metadata = { title: 'Reading list' };
export const dynamic = 'force-dynamic';

const STATUSES = [
  ['reading', 'Currently reading'],
  ['next', 'Up next'],
  ['finished', 'Finished'],
];

export default async function ReadingAdminPage({ searchParams }) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('reading_list')
    .select('*')
    .order('updated_at', { ascending: false });

  const books = data ?? [];

  return (
    <>
      <h1 className="admin__title">Reading list</h1>
      {(error || searchParams.error) && (
        <p className="error-msg">{error?.message ?? searchParams.error}</p>
      )}

      <form action={addReading} style={{ marginBottom: '2rem' }}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required maxLength={200} />
        </div>
        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" type="text" maxLength={120} />
        </div>
        <div className="form-field">
          <label htmlFor="status">Shelf</label>
          <select id="status" name="status" defaultValue="reading">
            {STATUSES.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="note">Short note (optional)</label>
          <input id="note" name="note" type="text" maxLength={300} />
        </div>
        <button type="submit" className="btn">Add book</button>
      </form>

      {STATUSES.map(([key, label]) => {
        const group = books.filter((b) => b.status === key);
        return (
          <div key={key}>
            <h2 className="admin__subtitle">{label} ({group.length})</h2>
            {group.length === 0 && <p>Nothing here.</p>}
            {group.map((b) => (
              <div key={b.id} className="admin-row">
                <div style={{ flex: '1 1 260px' }}>
                  <h3 className="admin-row__title">{b.title}</h3>
                  <p className="admin-row__meta">
                    {b.author || 'Unknown author'}
                    {b.note ? ` · ${b.note}` : ''}
                  </p>
                </div>
                <div className="admin-row__actions">
                  {STATUSES.filter(([k]) => k !== b.status).map(([k, l]) => (
                    <form key={k} action={setReadingStatus.bind(null, b.id, k)}>
                      <button type="submit" className="btn btn--small">→ {l}</button>
                    </form>
                  ))}
                  <form action={deleteReading.bind(null, b.id)}>
                    <ConfirmButton
                      className="btn btn--small btn--danger"
                      message={`Remove "${b.title}" from the list?`}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}