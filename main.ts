import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const image = readFileSync(source);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

if (!image.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error('entry.png is not a PNG file');
}
if (statSync(source).size > 1024 * 1024) {
  throw new Error('entry.png exceeds the 1 MiB limit');
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'entry.png'));
