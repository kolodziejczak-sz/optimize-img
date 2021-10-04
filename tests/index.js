import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { readImage, transformImage, configure } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = path.join(__dirname, 'images');

const jpgImage = path.join(imagesDir, 'example.jpg');
const pngImage = path.join(imagesDir, 'example.png');

test.before(() => {
  configure((config) => ({
    ...config,
    cacheOptions: null,
  }));
});

test('readImage', async () => {
  const stats = await readImage(jpgImage);

  assert.equal(stats, {
    contentType: 'image/jpeg',
    fileName: 'example.jpg',
    filePath: jpgImage,
    format: 'jpg',
    height: 600,
    size: 54105,
    width: 800,
    url: undefined,
  });
});

test('transformImage without outputDir', async () => {
  const stats = await transformImage(jpgImage, {
    widths: [50],
    formats: ['webp', 'avif'],
  });

  assert.equal(stats, {
    webp: [
      {
        contentType: 'image/webp',
        fileName: 'example-50.webp',
        filePath: undefined,
        format: 'webp',
        height: 38,
        size: 672,
        width: 50,
        url: undefined,
      },
    ],
    avif: [
      {
        contentType: 'image/avif',
        fileName: 'example-50.avif',
        filePath: undefined,
        format: 'avif',
        height: 38,
        size: 742,
        width: 50,
        url: undefined,
      },
    ],
  });
});

test.run();
