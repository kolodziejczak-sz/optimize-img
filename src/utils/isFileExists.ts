import { accessSync } from 'fs';

export const isFileExistsSync = (filePath: string) => {
  try {
    accessSync(filePath);
    return true;
  } catch {
    return false;
  }
};
