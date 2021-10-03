export const isUrl = (path: string) => {
  let url: URL;
  try {
    url = new URL(path);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};
