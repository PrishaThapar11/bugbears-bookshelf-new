import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';
import SoundLink from '../../components/SoundLink';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Bugbear: email, GitHub and LinkedIn.',
};

const ENTRIES = [
  {
    label: 'Email',
    stamp: 'Anytime',
    href: 'mailto:prish2900@gmail.com',
    icon: <FaEnvelope />,
  },
  {
    label: 'GitHub',
    stamp: 'Browse',
    href: 'https://github.com/PrishaThapar11',
    icon: <FaGithub />,
    external: true,
  },
  {
    label: 'LinkedIn',
    stamp: 'Connect',
    href: 'https://www.linkedin.com/in/prisha-thapar-355a082b9/',
    icon: <FaLinkedin />,
    external: true,
  },
];

export default function Contact() {
  return (
    <div className="has-bg" style={{ '--bg': "url('/images/contact.jpg')" }}>
      <section className="libcard">
        <h1 className="sr-only">Contact</h1>

        <p className="libcard__org">Bugbear&apos;s Bookshelf · Lending Library</p>

        <div className="libcard__field">
          <span className="libcard__label">Title</span>
          <span className="libcard__value">Get in Touch with Bugbear</span>
        </div>
        <div className="libcard__field">
          <span className="libcard__label">Author</span>
          <span className="libcard__value">Prisha Thapar</span>
        </div>
        <div className="libcard__field">
          <span className="libcard__label">Call No.</span>
          <span className="libcard__value">BB · 2026 · 001</span>
        </div>

        <div className="libcard__table" role="list">
          <div className="libcard__tablehead">
            <span>Date Due</span>
            <span>Borrower&apos;s Name</span>
          </div>

          {ENTRIES.map((e) => (
            <SoundLink
              key={e.label}
              role="listitem"
              href={e.href}
              className="libcard__row"
              {...(e.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="libcard__due">
                <span className="stamp">{e.stamp}</span>
              </span>
              <span className="libcard__name">
                {e.icon} {e.label}
              </span>
            </SoundLink>
          ))}

          <div className="libcard__row libcard__row--blank" aria-hidden="true" />
          <div className="libcard__row libcard__row--blank" aria-hidden="true" />
        </div>

        <p className="libcard__foot">Letters are returned within a few days.</p>
      </section>
    </div>
  );
}