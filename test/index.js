import { transform } from '../dist/index.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, 'example.jpg');
const filePath2 = path.join(__dirname, 'example2.jpg');
console.log('starting tests');

console.time('allTransforms');

Promise.all([
  transform('https://images.unsplash.com/photo-1608178398319-48f814d0750c', {
    widths: [1200, 600],
    formats: ['mozjpeg'],
  }),
  // transform(filePath, {
  //   widths: [1200],
  //   formats: ['mozjpeg', 'webp'],
  // }),
  // transform(filePath2, {
  //   widths: [600],
  //   formats: ['jxl'],
  // }),
]).then(() => {
  console.timeEnd('allTransforms');
});
