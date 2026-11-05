import { FaDove, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';

export const metadata = {
  title: 'Contact',
  description: "Get in touch with Bugbear: email, GitHub and LinkedIn.",
};

export default function Contact() {
  return (
    <div className="has-bg" style={{ '--bg': "url('/images/contact.jpg')" }}>
      <section className="contact-card">
        <h1>
          Get in Touch with Bugbear <FaDove />
        </h1>

        <div className="contact-links">
          <a href="mailto:prish2900@gmail.com" className="contact-item">
            <FaEnvelope /> Email
          </a>
          <a
            href="https://github.com/PrishaThapar11"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/prisha-thapar-355a082b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <FaLinkedin /> LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}