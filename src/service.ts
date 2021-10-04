import { withCache } from './cache';
import { getConfig } from './config';
import { getImageStats, GetImageStatsFn } from './getImageStats';
import { transform, TransformFn } from './transform';

export const transformImage: TransformFn = async (filePath, options) => {
  try {
    const shouldUseCache = Boolean(getConfig().cacheOptions);
    const transformFn = shouldUseCache ? withCache(transform) : transform;
    const value = await transformFn(filePath, options);

    return value;
  } catch (error) {
    console.error(
      `Image optimizer: image ${filePath} transform failed, ${error}`
    );
  }
};

export const readImage: GetImageStatsFn = async (filePath) => {
  try {
    const shouldUseCache = Boolean(getConfig().cacheOptions);
    const readImageFn = shouldUseCache
      ? withCache(getImageStats)
      : getImageStats;
    const value = await readImageFn(filePath);

    return value;
  } catch (error) {
    console.error(
      `Image optimizer: image ${filePath} reading failed, ${error}`
    );
  }
};
