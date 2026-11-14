'use client';

import { useSound } from './SoundProvider';

export default function FlatBook({ style, children }) {
  const { play } = useSound();

  return (
    <article
      className="flatbook"
      style={style}
      onMouseEnter={() => play('book-slide')}
    >
      {children}
    </article>
  );
}