export default function PawEmblem({ className, mini = false, decorative = false }) {
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': 'Bear paw emblem' };

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" {...a11y}>
      {mini ? (
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="9" />
      ) : (
        <>
          {/* double ring */}
          <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="87" stroke="currentColor" strokeWidth="1" />
          {/* beaded ring */}
          <circle
            cx="100"
            cy="100"
            r="78"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
        </>
      )}

      {/* the paw */}
      <g fill="currentColor" transform={mini ? 'translate(-12 -22) scale(1.12)' : undefined}>
        <path d="M100 108 C80 108 62 126 62 144 C62 159 75 166 88 161 C94 159 106 159 112 161 C125 166 138 159 138 144 C138 126 120 108 100 108 Z" />
        <ellipse cx="60" cy="100" rx="12" ry="16" transform="rotate(-22 60 100)" />
        <ellipse cx="84" cy="72" rx="12.5" ry="17.5" transform="rotate(-8 84 72)" />
        <ellipse cx="116" cy="72" rx="12.5" ry="17.5" transform="rotate(8 116 72)" />
        <ellipse cx="140" cy="100" rx="12" ry="16" transform="rotate(22 140 100)" />
      </g>

      {/* small stars */}
      {!mini && (
        <g fill="currentColor">
          <path d="M100 28 l2.4 5.6 6 .5-4.6 4 1.4 5.9-5.2-3.2-5.2 3.2 1.4-5.9-4.6-4 6-.5z" />
          <circle cx="46" cy="148" r="2" />
          <circle cx="154" cy="148" r="2" />
        </g>
      )}
    </svg>
  );
}