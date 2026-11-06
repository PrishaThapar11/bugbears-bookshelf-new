import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="has-bg" style={{ '--bg': "url('/images/home.jpg')" }}>
      <section className="container" style={{ textAlign: 'center' }}>
        <h1 className="page-title">404: this page wandered off</h1>
        <p style={{ color: 'var(--color-cream)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          The page you were looking for isn&apos;t on this shelf.
        </p>
        <Link href="/blog" className="btn">Browse the blogs</Link>
      </section>
    </div>
  );
}