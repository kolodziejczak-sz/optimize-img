import { FormatEnum } from 'sharp';
import path from 'path';

const rootDir = process.cwd();

export type SupportedFormats = keyof FormatEnum;

export interface Config {
  formats: SupportedFormats[];
  widths: number[];
  outputDirectory: string;
  cacheOptions: {
    duration: number;
    directory: string;
  };
}

export type ConfigFn = (existingConfig: Config) => Partial<Config>;

let _config: Config = {
  formats: ['jpeg', 'avif'],
  outputDirectory: path.join(rootDir, 'images'),
  widths: [null],
  cacheOptions: {
    duration: 8.64e7,
    directory: path.join(rootDir, '.cache'),
  },
};

export const getConfig = () => _config;

export const configure = (newConfig: ConfigFn | Partial<Config>) => {
  if (typeof newConfig === 'function') {
    newConfig = newConfig(_config);
  }

  _config = {
    ..._config,
    ...newConfig,
  };
};
