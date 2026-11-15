'use client';

import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useSound } from './SoundProvider';

// Pages that are out of sight can't be tabbed to or read by screen readers
const hide = (cond) => (cond ? { inert: '', 'aria-hidden': true } : {});

export default function AboutBook({ titlePage, story, storyMore, reading }) {
  const [flipped, setFlipped] = useState(false);
  const { play } = useSound();
  const tomeRef = useRef(null);
  const first = useRef(true);

  function turn(to) {
    if (to === flipped) return;
    setFlipped(to);
    play('page-turn');
  }

  // On phones the pages are stacked, so bring the top of the book back into view after a turn
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia('(max-width: 760px)').matches) {
      tomeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [flipped]);

  // Left and right arrow keys turn the page too
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' && !flipped) {
        setFlipped(true);
        play('page-turn');
      }
      if (e.key === 'ArrowLeft' && flipped) {
        setFlipped(false);
        play('page-turn');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, play]);

  return (
    <>
      <div className="tome" data-flipped={flipped} ref={tomeRef}>
        {/* left page of spread 1: title page */}
        <div className="tome__base tome__base--left pg pg--l" {...hide(flipped)}>
          <div className="pg__inner">{titlePage}</div>
        </div>

        {/* right page of spread 2: reading list (revealed when the leaf turns) */}
        <div className="tome__base tome__base--right pg pg--r" {...hide(!flipped)}>
          <span className="ribbon" aria-hidden="true" />
          <div className="pg__inner">{reading}</div>
          <span className="folio">3</span>
        </div>

        {/* the page that turns: story on the front, the rest of the story on the back */}
        <div className="tome__leaf">
          <div className="tome__face tome__face--front pg pg--r" {...hide(flipped)}>
            <div className="pg__inner">{story}</div>
            <span className="folio">1</span>
          </div>
          <div className="tome__face tome__face--back pg pg--l" {...hide(!flipped)}>
            <div className="pg__inner">{storyMore}</div>
            <span className="folio">2</span>
          </div>
        </div>
      </div>

      <nav className="tome-nav" aria-label="Turn the pages">
        <button
          type="button"
          className="tome-turn"
          onClick={() => turn(false)}
          disabled={!flipped}
        >
          <FaChevronLeft /> Turn back
        </button>

        <span className="tome-nav__label" aria-live="polite">
          {flipped ? 'Pages 2 – 3' : 'Page 1'}
        </span>

        <button
          type="button"
          className="tome-turn"
          onClick={() => turn(true)}
          disabled={flipped}
        >
          Turn the page <FaChevronRight />
        </button>
      </nav>
    </>
  );
}