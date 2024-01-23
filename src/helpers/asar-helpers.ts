import { app } from '@electron/remote';
import { join } from 'path';

export function asarPath(dir: string = '') {
  return dir.replace('app.asar', 'app.asar.unpacked');
}

export function asarRecipesPath(...segments: string[]) {
  return join(asarPath(join(app.getAppPath(), process.env.NODE_ENV === 'development' ? 'recipes/archives' : 'recipes')), ...[segments].flat());
}
