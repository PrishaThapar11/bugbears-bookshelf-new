export const metadata = {
  title: 'About Me',
  description:
    "Hey, this is Bugbear. Why the name, who's behind Bugbear's Bookshelf, and what this little corner of the internet is for.",
};

// Paste the six lines from your old about.html between the backticks below.
// Keep each line on its own line.
const lyrics = `"I feel so brain dead next to you
It's not like you intended to
Hurt me or make me feel that way
And I'm not tryin' to complain
But it just sucks to try and explain
Why I feel like this everyday"`;

export default function About() {
  return (
    <div className="has-bg" style={{ '--bg': "url('/images/about.jpg')" }}>
      <article className="post">
        <h1>About Me 🐻</h1>

        <div className="post__body">
          <p>
            Hey there, this is Bugbear. Welcome to my humble little corner of the
            internet—Bugbear&apos;s Bookshelf.
          </p>

          <p>
            You might be wondering, why “Bugbear”? It&apos;s a name that stuck with me
            after listening to Bugbear by Chloe Moriondo. It goes like this:
          </p>

          <blockquote style={{ whiteSpace: 'pre-line' }}>{lyrics}</blockquote>

          <p>
            The song&apos;s chill, almost mocking tone makes light of things that are
            actually kind of serious—feeling out of place, a little lost, a little
            slower to pick up on things that seem effortless to others. And yes, that
            hit a little too close to home.
          </p>

          <p>
            Not because I think I&apos;m stupid—I know I&apos;m not. But sometimes, my
            words come out wrong, or I struggle with the most basic everyday things
            like directions, organizing my stuff, or making quick decisions. I like
            thinking things through, picking apart details, and observing people more
            than my surroundings. It&apos;s funny how that works.
          </p>

          <p>
            I&apos;m not one to brag, but I&apos;m what you call &quot;academically
            gifted&quot;, I&apos;m adept at solving problems, and my head is full of
            all sorts of random knowledge, but I never feel the need to prove it.
            Maybe that&apos;s why I&apos;m sometimes mistaken for being naive, quiet,
            or just “there.” This is why her song stuck with me like superglue. But
            that&apos;s okay. This blog is my way of creating a space that&apos;s
            mine—a place where I can talk about books, thoughts, tech, and everything
            in between.
          </p>

          <p>
            And who knows? Maybe one day, I&apos;ll prove just how smart I really am.
          </p>

          <p className="signoff">
            hugs and kisses,
            <br />
            Bugbear&hearts;
          </p>
        </div>
      </article>
    </div>
  );
}