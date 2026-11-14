'use client';

import { useSound } from './SoundProvider';

export default function SoundLink({ sound = 'book-slide', children, ...props }) {
  const { play } = useSound();

  return (
    <a {...props} onMouseEnter={() => play(sound)} onFocus={() => play(sound)}>
      {children}
    </a>
  );
}