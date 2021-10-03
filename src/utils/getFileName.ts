import path from 'path';

export const getFileName = (filePath: string) => {
  return path.parse(filePath).name;
};
