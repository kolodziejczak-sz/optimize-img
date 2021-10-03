export const getImageDimensions = (
  initialWidth: number,
  initialHeight: number,
  targetWidth?: number
) => {
  if (!targetWidth) {
    return [initialWidth, initialHeight];
  }

  const currentAspect = initialWidth / initialHeight;

  return [targetWidth, Math.round(targetWidth / currentAspect)];
};
