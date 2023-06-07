// @ts-check
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import ms from 'ms'
import { debounce } from 'lodash-es'
import { useLocalStorage } from '@vueuse/core'
import type { Service, ServiceStore } from '../types'
import { LinkHandling } from '../types'

export const useServiceStore = defineStore({
  id: 'services',
  state: (): ServiceStore => ({
    allServices: [
      {
        url: 'https://discord.com/app',
        preload: true,
        name: 'Discord',
        _webview: undefined,
        lastUsed: Date.now(),
        lastHibernated: null,
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'test',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true,
        enable: true,
        isNotificationEnabled: true,
        isSoundsEnabled: true,
        isShowNameInTabEnabled: true,
        isHibernateEnabled: false,
        isHibernating: false,
        isMediaPlaying: false,

        isUnreadInTabEnabled: true,
        isUnreadInGlobalEnabled: true,
        linkHandling: LinkHandling.Default,
      },
      {
        url: 'https://web.telegram.org/a/',
        preload: true,
        name: 'Telegram',
        _webview: undefined,
        lastUsed: Date.now(),
        lastHibernated: null,
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'telegram',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true,
        isNotificationEnabled: true,
        enable: true,
        isSoundsEnabled: true,
        isShowNameInTabEnabled: true,
        isHibernateEnabled: false,
        isHibernating: false,
        isMediaPlaying: false,

        isUnreadInTabEnabled: true,
        isUnreadInGlobalEnabled: true,
        linkHandling: LinkHandling.Default,

      },
      {
        url: 'https://www.aliyundrive.com/drive',
        preload: false,
        name: '阿里云盘',
        _webview: undefined,
        lastUsed: Date.now(),
        lastHibernated: null,
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'aliyundrive',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true,
        isNotificationEnabled: true,
        enable: true,
        isSoundsEnabled: true,
        isShowNameInTabEnabled: true,
        isHibernateEnabled: true,
        isHibernating: false,
        isMediaPlaying: false,

        isUnreadInTabEnabled: true,
        isUnreadInGlobalEnabled: true,
        linkHandling: LinkHandling.Default,

      },
      ...useLocalStorage<Service[]>('custom-service', []).value,
    ],
    teardown: null,
  }),
  getters: {
    displayServices(): Service[] {
      // return this.allServices.filter(() => false)
      return this.allServices as Service[]
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
        service.lastUsed = Date.now()
        service.isActive = true
      }
    },
    reload({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service) {
        service.isLoading = true
        this.awake({ serviceId })
        service._webview?.reload()
      }
    },
    addService(service: Service) {
      // TODO: maybe use folder
      const customAppStorage = useLocalStorage<Service[]>('custom-service', [])
      // custom service
      if (service.isCustom) {
        service.id = nanoid()
        customAppStorage.value.push(service)
      }
      else {
        // TODO: save service
      }
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
