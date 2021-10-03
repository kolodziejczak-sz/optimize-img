import fs from 'fs/promises';
import path from 'path';
import {
  getArrayBuffer,
  getContentType,
  getFileName,
  getImageDimensions,
} from './utils';
import { closeImagePool, getImagePool } from './imagePool';
import { Config } from './config';

export type TransformOptions = Pick<
  Config,
  'formats' | 'widths' | 'outputDirectory'
>;

export type TransformResults = {
  [format: string]: ImageStats[];
};

export type ImageStats = {
  contentType: string;
  fileName: string;
  filePath: string;
  format: string;
  optionsUsed: Record<string, any>;
  height: number;
  size: number;
  width: number;
};

export const transform = async (
  filePath: string,
  { formats, outputDirectory, widths = [null] }: TransformOptions
): Promise<TransformResults> => {
  const imagePool = getImagePool();
  const shouldWrite = Boolean(outputDirectory);

  const arrayBuffer = await getArrayBuffer(filePath);
  const image = imagePool.ingestImage(arrayBuffer);
  const { bitmap } = await image.decoded;

  const transformResults: TransformResults = {};
  const encodeOptions = Object.fromEntries(
    formats.map((format) => [format, 'auto'])
  );

  for (const targetWidth of widths) {
    const [w, h] = getImageDimensions(bitmap.width, bitmap.height, targetWidth);

    if (targetWidth) {
      await image.preprocess({
        resize: { enabled: true, width: w, height: h },
      });
    }

    await image.encode(encodeOptions);

    for (const encodedImage of Object.values(image.encodedWith)) {
      const { extension, size, binary, optionsUsed }: any = await encodedImage;
      const newFileName = [
        getFileName(filePath),
        `-${targetWidth || w}`,
        `.${extension}`,
      ].join('');

      const newFilePath = shouldWrite
        ? path.join(outputDirectory, newFileName)
        : undefined;

      if (shouldWrite) {
        await fs.writeFile(newFileName, binary);
      }

      (transformResults[extension] ??= []).push({
        contentType: getContentType(extension),
        fileName: newFileName,
        filePath: newFilePath,
        format: extension,
        height: h,
        optionsUsed,
        size,
        width: w,
      });
    }
  }

  closeImagePool();

  return transformResults;
};
