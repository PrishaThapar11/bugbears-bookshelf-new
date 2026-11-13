export const COVERS = [
  { a: '#5a1328', b: '#34091a' }, // oxblood
  { a: '#2f1b45', b: '#190e28' }, // midnight plum
  { a: '#18403a', b: '#0d2420' }, // bottle green
  { a: '#4f1233', b: '#2e0a1e' }, // wine
  { a: '#42301d', b: '#25190d' }, // old leather
  { a: '#1f2848', b: '#111729' }, // ink blue
];

// Same slug always gives the same colour and offset, so nothing reshuffles
export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function coverFor(slug) {
  const h = hash(slug);
  const c = COVERS[h % COVERS.length];
  return { a: c.a, b: c.b, offset: ((h >>> 5) % 29) - 14 }; // offset: -14px to +14px
}