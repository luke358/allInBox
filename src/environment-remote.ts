import { app } from '@electron/remote';
import { join } from 'path';

export function userDataPath(...segments: string[]): string {
  return join(app.getPath('userData'), ...[segments].flat());
}

export function userDataRecipesPath(...segments: string[]): string {
  return userDataPath('recipes', ...[segments].flat());
}
