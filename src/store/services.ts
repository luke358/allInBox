// @ts-check
import { defineStore } from 'pinia'
import { Service, ServiceStore } from '../types'

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
        lastHibernated: Date.now(),
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'test',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true
      },
      {
        url: 'https://web.telegram.org/a/',
        preload: true,
        name: 'Telegram',
        _webview: undefined,
        lastUsed: Date.now(),
        lastHibernated: Date.now(),
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'telegram',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true
      },
      {
        url: 'https://www.aliyundrive.com/drive',
        preload: false,
        name: '阿里云盘',
        _webview: undefined,
        lastUsed: Date.now(),
        lastHibernated: Date.now(),
        isActive: false,
        timer: null,
        isMuted: false,
        id: 'aliyundrive',
        iconUrl: 'xxx',
        isFirstLoad: true,
        isError: false,
        isLoading: true
      },
    ],
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
      this.allServices.forEach(service => service.isActive = false)
      const service = this.allServices.find(service => service.id === serviceId)
      service && (service.isActive = true)
    },
    reloadActive({ serviceId }: { serviceId: string }) {

    }
  },
})

