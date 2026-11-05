'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaRegHeart, FaPaw, FaBars, FaXmark } from 'react-icons/fa6';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blogs' },
  { href: '/about', label: 'About Me' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="site-header">
      <nav className="site-header__inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <FaRegHeart /> Bugbear&apos;s Bookshelf <FaRegHeart /> <FaPaw />
        </Link>

        <button
          className="menu-button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <FaXmark /> : <FaBars />}
        </button>

        <ul className={`nav-list ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`nav-link ${isActive(l.href) ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}