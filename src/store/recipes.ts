// @ts-check
import { defineStore } from 'pinia'
import { RecipeStore } from '@/types/recipe'

export const useServiceStore = defineStore({
  id: 'services',
  persist: {
    paths: ['allServices'],
  },
  state: (): RecipeStore => ({
    allRecipes: []
  }),
  getters: {
    all() {
      // this.allRecipes()
    }
  },
  actions: {
    async allRecipes() {
      
    }
  },
})
