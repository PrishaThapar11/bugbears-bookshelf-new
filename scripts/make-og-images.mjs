import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/images';
const OUT = 'public/og';

await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;

  const out = path.join(OUT, path.parse(file).name + '.jpg');

  await sharp(path.join(SRC, file))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(out);

  const kb = Math.round((await stat(out)).size / 1024);
  console.log(`${out}  ${kb} KB${kb > 300 ? '   <-- too big for WhatsApp' : ''}`);
}