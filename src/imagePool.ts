import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import { onProcessExit } from './utils';

let _imagePool: ImagePool;

export const getImagePool = () => {
  _imagePool = _imagePool || new ImagePool(cpus().length);
  return _imagePool;
};

export const closeImagePool = () => {
  if (_imagePool) {
    _imagePool.close();
    _imagePool = undefined;
  }
};

onProcessExit(() => closeImagePool);
