import path from 'path';
import { SupportedFormats } from '../config';

export const getFormat = (
  sourcePath: string,
  format: SupportedFormats
): SupportedFormats => {
  const extension = path.extname(sourcePath);
  return extension === '.jpg' && format === 'jpeg' ? 'jpg' : format;
};
