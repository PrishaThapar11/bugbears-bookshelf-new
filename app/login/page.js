import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase-server';

export const metadata = { title: 'Login', robots: { index: false, follow: false } };

async function login(formData) {
  'use server';
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (error) redirect('/login?error=1');
  redirect('/admin');
}

export default function LoginPage({ searchParams }) {
  return (
    <div className="admin">
      <div className="admin__inner login-card">
        <h1 className="admin__title">Admin login</h1>
        {searchParams.error && <p className="error-msg">Wrong email or password.</p>}
        <form action={login}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn">Log in</button>
        </form>
      </div>
    </div>
  );
}