import PawEmblem from '../../components/PawEmblem';
import AboutBook from '../../components/AboutBook';
import { getReading } from '../../lib/reading';

export const revalidate = 60;

export const metadata = {
  title: 'About Me',
  description:
    "Hey, this is Bugbear. Why the name, who's behind Bugbear's Bookshelf, and what this little corner of the internet is for.",
};

// One line from the song, in your own copy of the lyrics. Leave empty to hide the quote.
const QUOTE = ``;

function Entries({ books, empty }) {
  if (books.length === 0) return <p className="shelf-empty">{empty}</p>;
  return (
    <ul className="entries">
      {books.map((b) => (
        <li key={b.id}>
          <span className="entry__title">{b.title}</span>
          {b.author && <span className="entry__author">by {b.author}</span>}
          {b.note && <p className="entry__note">{b.note}</p>}
        </li>
      ))}
    </ul>
  );
}

export default async function About() {
  const reading = await getReading();
  const now = reading.filter((b) => b.status === 'reading').slice(0, 2);
  const next = reading.filter((b) => b.status === 'next').slice(0, 3);
  const done = reading.filter((b) => b.status === 'finished').slice(0, 3);

  const titlePage = (
    <div className="titlepage">
      <PawEmblem className="titlepage__emblem" />
      <p className="titlepage__ex">Ex Libris</p>
      <p className="titlepage__title">Bugbear&apos;s Bookshelf</p>
      <div className="rule"><span>✦</span></div>
      <p className="titlepage__by">by</p>
      <p className="titlepage__author">Prisha Thapar</p>
      <p className="titlepage__year">Est. 2025</p>
    </div>
  );

  const story = (
    <div className="obtext obtext--first">
      <h1>About Me 🐻</h1>

      <p>
        Hey there, this is Bugbear. Welcome to my humble little corner of the
        internet—Bugbear&apos;s Bookshelf.
      </p>

      <p>
        You might be wondering, why “Bugbear”? It&apos;s a name that stuck with me
        after listening to Bugbear by Chloe Moriondo. The singer talks about how she
        constantly feels &quot;braindead&quot; next to other people.
      </p>

      {QUOTE && <blockquote>{QUOTE}</blockquote>}

      <p>
        The song&apos;s chill, almost mocking tone makes light of things that are
        actually kind of serious—feeling out of place, a little lost, a little
        slower to pick up on things that seem effortless to others. And yes, that
        hit a little too close to home.
      </p>

      <p className="obcontinued">continued overleaf ›</p>
    </div>
  );

  const storyMore = (
    <div className="obtext">
      <p className="runhead">About Me · continued</p>

      <p>
        Not because I think I&apos;m stupid—I know I&apos;m not. But sometimes, my
        words come out wrong, or I struggle with the most basic everyday things
        like directions, organizing my stuff, or making quick decisions. I like
        thinking things through, picking apart details, and observing people more
        than my surroundings. It&apos;s funny how that works.
      </p>

      <p>
        I&apos;m not one to brag, but I&apos;m what you call &quot;academically
        gifted&quot;, I&apos;m adept at solving problems, and my head is full of all
        sorts of random knowledge, but I never feel the need to prove it. Maybe
        that&apos;s why I&apos;m sometimes mistaken for being naive, quiet, or just
        “there.” This is why her song stuck with me like superglue. But that&apos;s
        okay. This blog is my way of creating a space that&apos;s mine—a place where
        I can talk about books, thoughts, tech, and everything in between.
      </p>

      <p>
        And who knows? Maybe one day, I&apos;ll prove just how smart I really am.
      </p>

      <p className="obsign">
        hugs and kisses,
        <br />
        Bugbear&hearts;
      </p>
    </div>
  );

  const readingPage = (
    <>
      <section className="obsection">
        <h2 className="obpage__heading">Currently Reading</h2>
        <p className="obpage__sub">on the nightstand</p>
        <Entries books={now} empty="Between books at the moment. The shelf is waiting." />
      </section>

      <section className="obsection">
        <h3>Up Next</h3>
        <Entries books={next} empty="Nothing queued yet." />
      </section>

      <section className="obsection">
        <h3>Recently Finished</h3>
        <Entries books={done} empty="Nothing finished lately." />
      </section>
    </>
  );

  return (
    <div className="has-bg" style={{ '--bg': "url('/images/about.jpg')" }}>
      <AboutBook
        titlePage={titlePage}
        story={story}
        storyMore={storyMore}
        reading={readingPage}
      />
    </div>
  );
}