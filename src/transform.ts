import path from 'path';
import sharp from 'sharp';
import {
  getArrayBuffer,
  getContentType,
  getFileName,
  getFormat,
  getImageDimensions,
} from './utils';
import { Config } from './config';
import { ImageStats } from './getImageStats';

export type TransformOptions = Partial<
  Pick<Config, 'formats' | 'widths' | 'outputDirectory'>
>;

export type TransformResults = {
  [format: string]: ImageStats[];
};

export type TransformFn = typeof transform;

export const transform = async (
  sourcePath: string,
  { formats, widths = [null], outputDirectory }: TransformOptions
): Promise<TransformResults> => {
  const transformResults: TransformResults = {};
  const shouldWrite = Boolean(outputDirectory);

  const arrayBuffer = await getArrayBuffer(sourcePath);
  const initialImage = await sharp(arrayBuffer);
  const { format, width, height } = await sharp(arrayBuffer).metadata();
  const targetFormat = getFormat(sourcePath, format);

  for (const targetWidth of widths) {
    const [newWidth, newHeight] = getImageDimensions(
      width,
      height,
      targetWidth
    );
    const targetImage = initialImage.clone();

    if (targetWidth) {
      await targetImage.resize({ width: newWidth, height: newHeight });
    }

    for (const newFormat of formats || [targetFormat]) {
      const newImage = await targetImage.clone().toFormat(newFormat);

      const newFileName = `${getFileName(sourcePath)}-${newWidth}.${newFormat}`;

      const newFilePath = shouldWrite
        ? path.join(outputDirectory, newFileName)
        : undefined;

      let newSize = 0;

      if (shouldWrite) {
        await newImage.toFile(newFilePath).then(({ size }) => (newSize = size));
      } else {
        await newImage.toBuffer().then((buffer) => (newSize = buffer.length));
      }

      (transformResults[newFormat] ??= []).push({
        contentType: getContentType(newFormat),
        fileName: newFileName,
        filePath: newFilePath,
        format: newFormat,
        height: newHeight,
        size: newSize,
        width: newWidth,
        url: shouldWrite
          ? `./${path.relative(outputDirectory, newFilePath)}`
          : undefined,
      });
    }
  }

  return transformResults;
};
