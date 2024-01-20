import { join } from 'node:path';
import { userDataRecipesPath } from "../../environment-remote";

export default class ServerApi {
  recipes: any[] = []

  async getServices() {

  }
  async createService() {

  }

  async updateService() {

  }

  async uploadServiceIcon() {

  }

  healthCheck() {
    
  }

  async getRecipePackage(recipeId: string) {

    const recipesDirectory = userDataRecipesPath();
    // const recipeTempDirectory = join(recipesDirectory, 'temp', recipeId);
    // const tempArchivePath = join(recipeTempDirectory, 'recipe.tar.gz');

  }

  async getRecipePreviews() {
    // const request = await sendAuthRequest(`${apiBase()}/recipes`);
    // if (!request.ok) throw new Error(request.statusText);
    // const data = await request.json();
    // const recipePreviews = this._mapRecipePreviewModel(data);
    return [];
  }
}
