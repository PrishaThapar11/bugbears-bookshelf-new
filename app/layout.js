import './globals.css';
import { Cormorant_Garamond, EB_Garamond, Homemade_Apple } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Atmosphere from '../components/Atmosphere';
import { SITE_URL, SITE_NAME } from '../lib/site';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const garamond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-ebgaramond',
  display: 'swap',
});
const homemade = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-homemade',
  display: 'swap',
});

const DESCRIPTION =
  'Book reviews, essays and little life lessons from a cozy corner of the internet.';
const HOME_TITLE = `${SITE_NAME} | Book reviews, essays and reflections`;
const SHARE_IMAGE = {
  url: '/og/home.jpg',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  verification: {
    google: 'nGeOhCMagRHqsexnW0MMg4dj-pPvKewzbyfg0OU-qWM',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_IN',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: DESCRIPTION,
    images: ['/og/home.jpg'],
  },
};

export default function RootLayout({ children }) {
  const fontVars = [cormorant, garamond, homemade].map((f) => f.variable).join(' ');

  return (
    <html lang="en" className={fontVars}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Atmosphere />
      </body>
    </html>
  );
}