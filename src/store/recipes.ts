// @ts-check
import { defineStore } from 'pinia'
import { Recipe, RecipeStore } from '@/types/recipe'
import { ref } from 'vue'
import { Service } from '@/types'
import { userDataRecipesPath } from '@/environment-remote'
import { asarRecipesPath } from '@/helpers/asar-helpers'

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
    // filter duplicates
    const recipes = unfilteredRecipes.filter(
      (elem: string, pos: number, arr: string[]) =>
        arr.indexOf(elem) === pos,
    );

    return Promise.all(
      recipes.map(async (recipeId: string) => {
        let recipe = allRecipes.value.find(r => r.id === recipeId);

        if (!recipe) {
          console.warn(
            `Recipe '${recipeId}' not installed, trying to fetch from server`,
          );

          await getRecipePackage(recipeId);

          // debug('Rerun ServerAPI::getInstalledRecipes');
          // await this.getInstalledRecipes();

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

  const getRecipePackage = async (recipeId: string) => {
    const recipesDirectory = userDataRecipesPath();
    // const recipeTempDirectory = join(recipesDirectory, 'temp', recipeId);
    // const tempArchivePath = join(recipeTempDirectory, 'recipe.tar.gz');

    const internalRecipeFile = asarRecipesPath(`${recipeId}.tar.gz`);

    console.log(recipesDirectory, 'recipesDirectory', internalRecipeFile)

    // console.log(internalRecipeFile, 'ddddccc')
    // ensureDirSync(recipeTempDirectory);

    // let archivePath: PathOrFileDescriptor;

    // if (pathExistsSync(internalRecipeFile)) {
    //   debug('[ServerApi::getRecipePackage] Using internal recipe file');
    //   archivePath = internalRecipeFile;
    // } else {
    //   debug('[ServerApi::getRecipePackage] Downloading recipe from server');
    //   archivePath = tempArchivePath;

    //   const packageUrl = `${apiBase()}/recipes/download/${recipeId}`;

    //   const res = await window.fetch(packageUrl);
    //   debug('Recipe downloaded', recipeId);
    //   const blob = await res.blob();
    //   const buffer = await blob.arrayBuffer();
    //   writeFileSync(tempArchivePath, Buffer.from(buffer));
    // }
    // debug(archivePath);

    // await sleep(10);

    // // @ts-expect-error No overload matches this call.
    // await tar.x({
    //   file: archivePath,
    //   cwd: recipeTempDirectory,
    //   preservePaths: true,
    //   unlink: true,
    //   preserveOwner: false,
    //   onwarn: x => debug('warn', recipeId, x),
    // });

    // await sleep(10);

    // const { id } = readJsonSync(join(recipeTempDirectory, 'package.json'));
    // const recipeDirectory = join(recipesDirectory, id);
    // copySync(recipeTempDirectory, recipeDirectory);
    // removeSync(recipeTempDirectory);
    // removeSync(join(recipesDirectory, recipeId, 'recipe.tar.gz'));

    // return id;
  }
  return {
    allRecipes,
    getRecipeByServiceId
  }
})
