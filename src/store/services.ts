// @ts-check
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import ms from 'ms'
import { debounce } from 'lodash-es'
import type { Service, ServiceStore } from '../types'

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
      service.id = nanoid()
      service.timestamp = Date.now()
      // const customAppStorage = useLocalStorage<Service[]>('custom-service', [])
      // custom service
      if (service.isCustom)
        // customAppStorage.value.push(service)
        this.allServices.push(service)
      else
        this.allServices.push(service)
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
