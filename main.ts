import * as fs from 'node:fs';
import * as path from 'node:path';

// The submitted image is self-contained. No network or external packages.
const artwork = fs.readFileSync(new URL('entry.png', import.meta.url));
const expectedHeader = '89504e470d0a1a0a';
if (artwork.length < 45 || artwork.subarray(0, 8).toString('hex') !== expectedHeader) {
  throw new Error('The bundled artwork must be a complete PNG.');
}
const width = artwork.readUInt32BE(16);
const height = artwork.readUInt32BE(20);
if (width === 0 || height === 0 || width > 1024 || height > 1024) {
  throw new Error(`Image dimensions outside the bounty limits: ${width}x${height}`);
}
if (artwork.byteLength > 1_048_576) {
  throw new Error('The bundled artwork exceeds the 1 MiB cap.');
}
if (artwork.subarray(-8, -4).toString('ascii') !== 'IEND') {
  throw new Error('The PNG end marker is missing.');
}
const destination = path.resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'entry.png'), artwork);
