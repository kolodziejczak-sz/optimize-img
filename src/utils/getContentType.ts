const mimeTypes = {
  jpg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  jxl: 'image/jxl',
};

export const getContentType = (extension: string) => {
  return mimeTypes[extension];
};
