// @ts-check
import { defineStore } from 'pinia'
import type { ServiceStore } from '../types'

export const useServiceStore = defineStore({
  id: 'services',
  persist: {
    paths: ['allServices'],
  },
  state: (): ServiceStore => ({
    allServices: [],
    teardown: null,
  }),
  getters: {

  },
  actions: {
  },
})
