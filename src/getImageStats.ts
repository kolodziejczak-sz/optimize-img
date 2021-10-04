import sharp from 'sharp';
import {
  getArrayBuffer,
  getContentType,
  getFileName,
  getFormat,
  isUrl,
} from './utils';

export type ImageStats = {
  contentType: string;
  fileName: string;
  filePath: string;
  format: string;
  height: number;
  size: number;
  width: number;
  url: string;
};

export type GetImageStatsFn = typeof getImageStats;

export const getImageStats = async (
  sourcePath: string
): Promise<ImageStats> => {
  const isExternalSource = isUrl(sourcePath);
  const arrayBuffer = await getArrayBuffer(sourcePath);
  const { format, width, height, size } = await sharp(arrayBuffer).metadata();
  const newFormat = getFormat(sourcePath, format);

  return {
    contentType: getContentType(newFormat),
    fileName: `${getFileName(sourcePath)}.${newFormat}`,
    filePath: isExternalSource ? undefined : sourcePath,
    format: newFormat,
    height,
    size,
    width,
    url: isExternalSource ? sourcePath : undefined,
  };
};
