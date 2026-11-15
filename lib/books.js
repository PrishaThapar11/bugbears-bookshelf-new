export const COVERS = [
  { key: 'oxblood', name: 'Oxblood', a: '#5a1328', b: '#34091a' },
  { key: 'plum', name: 'Midnight plum', a: '#2f1b45', b: '#190e28' },
  { key: 'green', name: 'Bottle green', a: '#18403a', b: '#0d2420' },
  { key: 'wine', name: 'Wine', a: '#4f1233', b: '#2e0a1e' },
  { key: 'leather', name: 'Old leather', a: '#42301d', b: '#25190d' },
  { key: 'ink', name: 'Ink blue', a: '#1f2848', b: '#111729' },
  // picker-only extras
  { key: 'forest', name: 'Forest', a: '#1f3b24', b: '#0f2014' },
  { key: 'teal', name: 'Deep teal', a: '#14454f', b: '#0a2830' },
  { key: 'charcoal', name: 'Charcoal', a: '#3a3636', b: '#1c1a1a' },
  { key: 'aubergine', name: 'Aubergine', a: '#3d1a3f', b: '#211022' },
];

// Automatic colours only pick from the first six, so existing books never change
const AUTO_COUNT = 6;

// Same slug always gives the same offset (and automatic colour), so nothing reshuffles
export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function coverFor(slug, key) {
  const h = hash(slug);
  const chosen = key ? COVERS.find((c) => c.key === key) : null;
  const c = chosen ?? COVERS[h % AUTO_COUNT];
  return { a: c.a, b: c.b, offset: ((h >>> 5) % 29) - 14 }; // offset: -14px to +14px
}