import { parse } from 'node:path'
export function loadRecipeConfig(recipePath: string) {
  try {
    const configPath = `${recipePath}/package.json`;
    // Delete module from cache
    delete require.cache[require.resolve(configPath)];

    // eslint-disable-next-line import/no-dynamic-require
    const config = require(configPath);

    const moduleConfigPath = require.resolve(configPath);
    config.path = parse(moduleConfigPath).dir;
    console.log(config, 'config loadRecipe')
    return config;
  } catch (error) {
    console.error(error);
    return null;
  }
}
