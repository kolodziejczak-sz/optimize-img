export type SupportedFormats = 'mozjpeg' | 'webp' | 'avif' | 'jxl';

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
  formats: ['mozjpeg', 'avif'],
  outputDirectory: './public',
  widths: [null],
  cacheOptions: {
    duration: 60_000,
    directory: '.cache',
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
