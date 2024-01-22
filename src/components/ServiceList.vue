<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { nanoid } from 'nanoid'
import { cloneDeep } from 'lodash-es'
import { getDomain, loadConfig } from '../utils'
import type { Service } from '../types'
import { LinkHandling } from '../types'
import { useServiceStore } from '../store/services'

const emits = defineEmits(['handleService'])
const servicesStore = useServiceStore()

const services = ref<Service[]>([])

const initServices: Service[] = [
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
    id: nanoid(),
    serviceId: 'discord',
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
    sorted: 0,

    isUnreadInTabEnabled: true,
    isUnreadInGlobalEnabled: true,
    linkHandling: LinkHandling.Default,
    timestamp: Date.now(),

    recipeId: 'discord',
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
    id: nanoid(),
    serviceId: 'telegram',

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
    sorted: 0,
    timestamp: Date.now(),

    recipeId: 'telegram',
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
    id: nanoid(),
    serviceId: 'aliyundrive',
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
    sorted: 0,
    timestamp: Date.now(),

    recipeId: 'aliyundrive',
  },
]
onMounted(async () => {
  services.value = [...cloneDeep(initServices), ...cloneDeep(servicesStore.allServices.map(s => ({ ...s, ...loadConfig })))]
    .filter((service, index, ss) => ss
      .findIndex(s => s.serviceId === service.serviceId) === index)
    .sort((a, b) => a.timestamp - b.timestamp)
})
</script>

<template>
  <div grid="~ cols-4 gap-20px">
    <el-popover
      v-for="service in services" :key="service.id"
      placement="bottom-start" :title="service.name" :width="200" trigger="hover"
      :content="`this is service ${service.name}`"
    >
      <template #reference>
        <div
          hover:bg-gray-100 cursor-pointer pl-20px pr-8px py-15px rd-5px flex items-center
          @click="emits('handleService', service)"
        >
          <img
            w-40px h-40px
            :src="`https://api.iowen.cn/favicon/${getDomain(service.url)}.png`"
            alt=""
          >
          <div max-w-100px text-truncate ml-10px>
            {{ service.name }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
