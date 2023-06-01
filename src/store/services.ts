// @ts-check
import { defineStore } from 'pinia'
import { Service, ServiceStore } from '../types'

export const useServiceStore = defineStore({
  id: 'services',
  state: (): ServiceStore => ({
    allServices: []
  }),
  getters: {
    displayServices(): Service[] {
      // return this.allServices.filter(() => false)
      return this.allServices as Service[]
    }
  },
  actions: {
    awake({ serviceId }: { serviceId: string }) {

    },
    hibernate({ serviceId }: { serviceId: string }) {
      // TODO:
    },
    setActive({ serviceId }: { serviceId: string }) {

    },
    reloadActive({ serviceId }: { serviceId: string }) {

    }
  },
})

