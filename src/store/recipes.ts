import { join } from 'node:path';
// @ts-check
import { defineStore } from 'pinia'
import { Recipe, RecipeStore } from '@/types/recipe'
import { ref } from 'vue'
import { Service } from '@/types'
import { userDataRecipesPath } from '@/environment-remote'
import { asarRecipesPath } from '@/helpers/asar-helpers'
import { ensureDirSync, pathExistsSync, readJsonSync, removeSync, copySync, readdirSync, statSync } from 'fs-extra';
import sleep from '@/helpers/async-helpers';
import tar, { x } from 'tar';

export const useRecipeStore = defineStore('recipe',() => {
  const allRecipes = ref<Recipe[]>([])
  const cacheRecipeByServiceId: Record<string, Recipe> = {}
  const getRecipeByServiceId = async (service: Service) => {
    const recipeId = service.recipeId
    const serviceId = service.serviceId
    if(cacheRecipeByServiceId[serviceId]) return cacheRecipeByServiceId[serviceId]
    const recipe = allRecipes.value.find((recipe) => recipe.id === recipeId)
    if(recipe) return (cacheRecipeByServiceId[serviceId] = recipe);

    const recipes = [service.recipeId]
    // 加载 recipe
    await _bulkRecipeCheck(recipes)

    return cacheRecipeByServiceId[serviceId]
  }

  const _bulkRecipeCheck = (unfilteredRecipes: string[]) => {
    // filter duplicates 现在其实就一个
    const recipes = unfilteredRecipes.filter(
      (elem: string, pos: number, arr: string[]) =>
        arr.indexOf(elem) === pos,
    );

    return Promise.all(
      recipes.map(async (recipeId: string) => {
        let recipe = allRecipes.value.find(r => r.id === recipeId);
        await getRecipePackage(recipeId);

        if (!recipe) {
          console.warn(
            `Recipe '${recipeId}' not installed, trying to fetch from server`,
          );

          await getInstalledRecipes();

          recipe = allRecipes.value.find(r => r.id === recipeId);

          if (!recipe) {
            console.warn(`Could not load recipe ${recipeId}`);
            return null;
          }
        }

        return recipe;
      }),
    ).catch(error => console.error("Can't load recipe", error));    
  }

  // 加载 recipe 文件
  const getRecipePackage = async (recipeId: string) => {
    const recipesDirectory = userDataRecipesPath();
    const recipeTempDirectory = join(recipesDirectory, 'temp', recipeId);
    // const tempArchivePath = join(recipeTempDirectory, 'recipe.tar.gz');

    const internalRecipeFile = asarRecipesPath(`${recipeId}.tar.gz`);

    ensureDirSync(recipeTempDirectory);

    let archivePath: string;

    if (pathExistsSync(internalRecipeFile)) {
      // debug('[ServerApi::getRecipePackage] Using internal recipe file');
      archivePath = internalRecipeFile;
    } else {
      // TODO: 先不考虑 recipe 不存在的情况
      // debug('[ServerApi::getRecipePackage] Downloading recipe from server');
      // archivePath = tempArchivePath;

      // const packageUrl = `${apiBase()}/recipes/download/${recipeId}`;

      // const res = await window.fetch(packageUrl);
      // debug('Recipe downloaded', recipeId);
      // const blob = await res.blob();
      // const buffer = await blob.arrayBuffer();
      // writeFileSync(tempArchivePath, Buffer.from(buffer));
    }
    // debug(archivePath);

    await sleep(10);

    await tar.x({
      file: archivePath!,
      cwd: recipeTempDirectory,
      preserveOwner: false,
      unlink: true,
      onwarn: x => console.warn(recipeId, x),
    });

    console.log(archivePath!, recipeTempDirectory)
    await sleep(10);

    const { id } = readJsonSync(join(recipeTempDirectory, 'package.json'));
    const recipeDirectory = join(recipesDirectory, id);
    copySync(recipeTempDirectory, recipeDirectory);
    removeSync(recipeTempDirectory);
    removeSync(join(recipesDirectory, recipeId, 'recipe.tar.gz'));

    return id;
  }
  // 通过 recipe 文件构造 recipe
  const getInstalledRecipes = async () => {
    const recipesDirectory = userDataRecipesPath();
    const paths = readdirSync(recipesDirectory).filter(
      file =>
        statSync(join(recipesDirectory, file)).isDirectory() &&
        file !== 'temp' &&
        file !== 'dev',
    );

    paths.map(id => {
      // const Recipe = require(id)(class RecipeModel {});

      // console.log(new Recipe())
    })

  }

  return {
    allRecipes,
    getRecipeByServiceId
  }
})
