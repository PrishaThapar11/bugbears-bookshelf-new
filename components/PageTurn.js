'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTurn() {
  const pathname = usePathname();
  const [prev, setPrev] = useState(pathname);
  const [turns, setTurns] = useState(0);

  // Runs while rendering, so the sheet is already in place the moment the new page appears
  if (pathname !== prev) {
    setPrev(pathname);
    setTurns(turns + 1);
  }

  const skip = pathname.startsWith('/admin') || pathname === '/login';
  if (turns === 0 || skip) return null; // nothing on the very first load

  return <div key={turns} className="pageturn" aria-hidden="true" />;
}