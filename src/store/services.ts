// @ts-check
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import ms from 'ms'
import { debounce, omit } from 'lodash-es'
import { useLocalStorage } from '@vueuse/core'
import { reactive } from 'vue'
import type { Service, ServiceStore } from '../types'
import { getUserServiceListByUser, saveUserService } from '../api/v1'
import { createInitialService } from '../utils'

const loadConfig = {
  isMediaPlaying: false,
  isFirstLoad: true,
  isError: false,
  isLoading: true,
}
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
    displayServices(): Service[] {
      // return this.allServices.filter(() => false)
      return (this.allServices as Service[]).sort((a, b) => a.sorted - b.sorted)
    },
    enabledServices(): Service[] {
      return this.allServices.filter(service => service.enable)
    },
  },
  actions: {
    async initData() {
      const initService = createInitialService(false)
      const servicesConfig = useLocalStorage<{ allServices: Service[] }>('services', {
        allServices: [],
      })

      const services = (await getUserServiceListByUser() || []).map(service =>
        ({
          ...initService,
          ...service,
          ...(servicesConfig.value.allServices.find(s => s.id === service.id) || {}) as Service,
          ...loadConfig,
        }))
      const customServices = useLocalStorage<Service[]>('custom-service', []).value.map(service => ({ ...initService, ...service, ...loadConfig }))

      this.allServices = reactive([...services, ...customServices])
    },
    serviceMaintenanceTick() {
      this.serviceMaintenance()
      this.teardown = debounce(this.serviceMaintenanceTick, ms('10s'))
      this.teardown()
    },
    serviceMaintenance() {
      for (const service of this.enabledServices) {
        if (!service.isActive) {
          if (
            !service.lastHibernated
            && Date.now() - service.lastUsed
            > ms('5m')
          ) {
            // If service is stale, hibernate it.
            this.hibernate({ serviceId: service.id })
          }
        }
      }
    },
    awake({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)

      if (service) {
        service.lastHibernated = null
        service.isHibernating = false
        service.lastUsed = Date.now()
        service.isLoading = true
      }
    },
    hibernate({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (!service?.isHibernateEnabled && !service?.isMediaPlaying)
        return

      service.isHibernating = true
      service.lastHibernated = Date.now()
    },
    enable({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service) {
        service.enable = true
        this.awake({ serviceId })
      }
    },
    setActive({ serviceId }: { serviceId: string }) {
      this.allServices.forEach((service) => {
        service.isActive = false
        service.lastUsed = Date.now()
      })
      const service = this.allServices.find(service => service.id === serviceId)
      if (service) {
        service.isActive = true
        service.lastUsed = Date.now()
        // fix: piniaPluginPersistedstate not working ? why ?
        localStorage.setItem('services', JSON.stringify({ allServices: this.allServices.map(s => omit(s, '_webview')) }))
      }
    },
    reload({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service && service.enable) {
        service.isLoading = true
        this.awake({ serviceId })
        service._webview?.reload()
      }
    },
    async addService(service: Service) {
      service.sorted = (Math.max(...this.allServices.map(s => s.sorted)) || 0) + 1
      // TODO: maybe use folder
      const customAppStorage = useLocalStorage<Service[]>('custom-service', [])
      // custom service
      if (service.isCustom) {
        service.id = nanoid()
        customAppStorage.value.push(service)
      }
      else {
        const res = await saveUserService({ appId: service.id, ...omit(service, 'id') })
        if (res)
          this.allServices.push(service)
      }
    },
    didMediaPlaying({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service)
        service.isMediaPlaying = true
    },
    didMediaPaused({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service)
        service.isMediaPlaying = false
    },
  },
})
