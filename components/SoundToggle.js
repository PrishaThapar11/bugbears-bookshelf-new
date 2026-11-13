'use client';

import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { useSound } from './SoundProvider';

export default function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? <FaVolumeHigh /> : <FaVolumeXmark />}
    </button>
  );
}