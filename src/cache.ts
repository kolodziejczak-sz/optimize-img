import path from 'path';
import hash from 'hash-sum';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { onProcessExit, isFileExistsSync } from './utils';
import { getConfig } from './config';
import { TransformResults } from './transform';
import { ImageStats } from './getImageStats';

type CacheEntry = {
  value: TransformResults | ImageStats;
  createdAt: number;
  duration: number;
};

type Cache = {
  [hash: string]: CacheEntry;
};

let cache: Cache = {};
let isInited: boolean = false;

const CACHE_FILE_NAME = 'img_cache.json';

export const withCache = <T extends (...args) => Promise<any>>(func: T) => {
  initCache();

  return async function () {
    const cacheKey = hash(arguments);
    const cachedValue = getCacheValue(cacheKey);

    if (cachedValue) {
      return cachedValue;
    }

    const value = await func.apply(null, arguments);
    createCacheEntry(cacheKey, value);

    return value;
  } as T;
};

export const clearCache = () => {
  cache = {};
};

export const getCache = () => {
  return cache;
};

const getCacheValue = (cacheKey: string) => {
  const cacheEntry = cache[cacheKey];

  if (cacheEntry) {
    return cacheEntry.value;
  }
};

const createCacheEntry = (
  cacheKey: string,
  result: TransformResults | ImageStats
) => {
  const { duration } = getCacheOptions();
  const cacheEntry: CacheEntry = {
    value: result,
    createdAt: Date.now(),
    duration,
  };

  cache[cacheKey] = cacheEntry;

  writeCache();
};

const initCache = () => {
  if (isInited) return;

  readCache();
  validateCache();
  onProcessExit(writeCache);

  isInited = true;
};

const getCacheOptions = () => {
  return getConfig().cacheOptions;
};

const getCachePath = () => {
  const { directory } = getCacheOptions();
  return path.join(directory, CACHE_FILE_NAME);
};

const readCache = () => {
  const cachePath = getCachePath();
  const isCacheFileExists = isFileExistsSync(cachePath);

  try {
    if (isCacheFileExists) {
      const fileContent = readFileSync(cachePath);
      cache = JSON.parse(fileContent.toString());
      return;
    }

    mkdirSync(getCacheOptions().directory);
  } catch {
    //
  }
};

const writeCache = () => {
  const { directory } = getCacheOptions();
  const cachePath = path.join(directory, CACHE_FILE_NAME);
  try {
    writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const validateCache = () => {
  for (const cacheKey in cache) {
    const cacheValue = cache[cacheKey];
    const isValid = !isValidCacheEntry(cacheValue);

    if (!isValid) {
      delete cache[cacheKey];
    }
  }
};

const isValidCacheEntry = (cacheEntry: CacheEntry) => {
  const isExpired = cacheEntry.createdAt + cacheEntry.duration < Date.now();
  if (isExpired) {
    return false;
  }

  const isImageStats = typeof cacheEntry.value.width === 'number';
  if (isImageStats) {
    return true;
  }

  const filePaths = Object.values(cacheEntry.value as TransformResults)
    .map((imageStats) =>
      imageStats.map(({ filePath }) => filePath).filter(Boolean)
    )
    .flat();

  for (const filePath of filePaths) {
    const isFileEntryExists = isFileExistsSync(filePath);
    if (!isFileEntryExists) return false;
  }
};
