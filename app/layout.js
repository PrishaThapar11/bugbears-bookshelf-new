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

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-playfair', display: 'swap' });
const satisfy = Satisfy({ subsets: ['latin'], weight: '400', variable: '--font-satisfy', display: 'swap' });
const homemade = Homemade_Apple({ subsets: ['latin'], weight: '400', variable: '--font-homemade', display: 'swap' });
const badScript = Bad_Script({ subsets: ['latin'], weight: '400', variable: '--font-badscript', display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', display: 'swap' });

export const metadata = {
    metadataBase: new URL('https://bugbears-bookshelf-new.vercel.app'),
  title: {
    default: "Bugbear's Bookshelf",
    template: "%s | Bugbear's Bookshelf",
  },
  description: 'Book reviews, essays and little life lessons from a cozy corner of the internet.',
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

