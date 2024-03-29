// @ts-check
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import ms from 'ms'
import { debounce } from 'lodash-es'
import type { ElectronWebView, Service, ServiceStore } from '../types'
import { useRecipeStore } from './recipes'
import { toRaw } from 'vue'

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
      return (this.allServices as Service[]).filter(service => service.enable)
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
      const service = this.one(serviceId)

      if (service) {
        service.lastHibernated = null
        service.isHibernating = false
        service.lastUsed = Date.now()
        service.isLoading = true
      }
    },
    hibernate({ serviceId }: { serviceId: string }) {
      const service = this.one(serviceId)
      if (!service?.isHibernateEnabled && !service?.isMediaPlaying)
        return

      service.isHibernating = true
      service.lastHibernated = Date.now()
    },
    enable({ serviceId }: { serviceId: string }) {
      const service = this.one(serviceId)
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
      const service = this.one(serviceId)
      if (service) {
        service.isActive = true
        service.lastUsed = Date.now()
      }
    },
    reload({ serviceId }: { serviceId: string }) {
      const service = this.one(serviceId)
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
      const service = this.one(serviceId)
      if (service)
        service.isMediaPlaying = true
    },
    didMediaPaused({ serviceId }: { serviceId: string }) {
      const service = this.allServices.find(service => service.id === serviceId)
      if (service)
        service.isMediaPlaying = false
    },
    one(id: string): Service {
      return this.allServices.find(service => service.id === id) as Service;
    },
    setWebviewReference({ serviceId, webview }: { serviceId: string, webview: ElectronWebView }) {
      const service = this.one(serviceId)
      if (service) {
        service._webview = webview;
        this.initializeWebViewEvents(service)
        // service.initializeWebViewEvents({
        //   handleIPCMessage: this.actions.service.handleIPCMessage,
        //   openWindow: this.actions.service.openWindow,
        //   stores: this.stores,
        // });
        // service.initializeWebViewListener();

      }

    },
    initializeWebViewEvents(service: Service) {
      service._webview?.addEventListener('ipc-message', (e) => {
        this._handleIPCMessage({
          serviceId: service.id,
          channel: e.channel,
          args: e.args,
        });
      })
    },
    _handleIPCMessage({ serviceId, channel, args }: { serviceId: string, channel: string, args: any }) {

      switch (channel) {
        case 'hello': {
          this._initRecipePolling(serviceId);
          this._initializeServiceRecipeInWebview(serviceId);
          // this._shareSettingsWithServiceProcess();

          break;
        }
        case 'alive': {
          const service = this.one(serviceId);
          service.lastPollAnswer = Date.now();
          break;
        }
        case 'message-counts': {
          const service = this.one(serviceId);
          service.unreadDirectMessageCount = args[0].direct;
          service.unreadIndirectMessageCount = args[0].indirect;
  
          break;
        }
      }
    },

    async _initRecipePolling(serviceId: string) {
      const service = this.one(serviceId);
      const delay = ms('2s');
      if (service) {
        if (service.timer !== null) {
          clearTimeout(service.timer);
        }

        const loop = () => {
          if (!service._webview) return;

          service._webview.send('poll');

          service.timer = setTimeout(loop, delay);
          service.lastPoll = Date.now();
        };

        loop();
      }
    },
    async _initializeServiceRecipeInWebview(serviceId: string) {
      const service = this.one(serviceId);
      if (service && service._webview) {
        const recipeStore = useRecipeStore()
        const recipe = await recipeStore.getRecipeByServiceId(service)
        console.log(recipe, 'ddddddd')
        service._webview.send('initialize-recipe', {
          version: '1.1'
        }, toRaw(recipe))
      }
    }
  },
})
