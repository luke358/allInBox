<script setup lang="ts">
import { ref } from 'vue'
import WebView from '../components/WebView.vue'
import { useServiceStore } from '../store/services'
import type { Service } from '../types'
import Sidebar from '../components/Sidebar.vue'
import Setting from '../components/Setting.vue'

const services = useServiceStore()
function changeWebView(service: Service) {
  // console.log(item.url)
  services.setActive({ serviceId: service.id })
  urlRendered.value.add(service.id)
}
const settings = [
  {
    icon: 'i-carbon-search',
  },
  {
    icon: 'i-ion-extension-puzzle-outline',
  },
  {
    icon: 'i-carbon-settings',
  },
]
// const services = [
//   { src: 'https://mail.google.com/mail', name: 'Gmail' },
//   { src: 'https://twitter.com/', name: 'Twitter' },
//   { src: 'https://github.com/', name: 'Github' },
//   { src: 'https://www.aliyundrive.com/drive', name: '阿里云盘' },
//   // preload 初始强制加载
//   { src: 'https://discord.com/app', preload: true, name: 'Discord' },
//   { src: 'https://web.telegram.org/a/', preload: true, name: 'Telegram' },
// ]

// 初始是否渲染
const urlRendered = ref<Set<string>>(new Set())

const SETTING_HEIGHT = 45 * settings.length + 60
</script>

<template>
  <div class="home" flex>
    <div flex flex-col bg-hex-f0f2f5 pt-5px pb-3px>
      <div :style="{ height: `calc(100vh - ${SETTING_HEIGHT}px)` }" box-border overflow-hidden>
        <Sidebar :services="services.displayServices" @change="changeWebView" />
      </div>
      <Setting :settings="settings" />
    </div>
    <div class="w-100% h-100%">
      <div
        v-for="service in services.displayServices" v-show="service.isActive"
        class="w-100% h-100%"
      >
        <WebView
          v-if="service.preload || urlRendered.has(service.id)"
          :service="service"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100%;
}
</style>
