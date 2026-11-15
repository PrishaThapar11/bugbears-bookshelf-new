export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} by Prisha Thapar. All Rights Reserved.</p>
      <p>Built with &hearts; by Bugbear.</p>
      <p className="footer-links">
        <a href="/feed.xml">RSS feed</a>
      </p>
    </footer>
  );
}