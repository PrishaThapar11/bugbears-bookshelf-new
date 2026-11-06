import './globals.css';
import {
  Playfair_Display,
  Satisfy,
  Homemade_Apple,
  Bad_Script,
  Dancing_Script,
} from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SITE_URL, SITE_NAME } from '../lib/site';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-playfair', display: 'swap' });
const satisfy = Satisfy({ subsets: ['latin'], weight: '400', variable: '--font-satisfy', display: 'swap' });
const homemade = Homemade_Apple({ subsets: ['latin'], weight: '400', variable: '--font-homemade', display: 'swap' });
const badScript = Bad_Script({ subsets: ['latin'], weight: '400', variable: '--font-badscript', display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', display: 'swap' });

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
  const fontVars = [playfair, satisfy, homemade, badScript, dancing]
    .map((f) => f.variable)
    .join(' ');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+IN:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={fontVars}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
