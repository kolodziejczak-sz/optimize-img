import fs from 'fs/promises';
import fetch from 'node-fetch';
import { isUrl } from './isUrl';

export const getArrayBuffer = (filePath: string) => {
  if (isUrl(filePath)) {
    return fetch(filePath).then((response) => response.buffer());
  }
  return fs.readFile(filePath);
};
