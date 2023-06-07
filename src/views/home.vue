<script setup lang="ts">
import { ref } from 'vue'
import ServiceView from '../components/ServiceView.vue'
import { useServiceStore } from '../store/services'
import type { Service } from '../types'
import Sidebar from '../components/Sidebar.vue'
import Setting from '../components/Setting.vue'
import AddServiceDrawer from '../components/AddServiceDrawer.vue'
import ServiceList from '../components/ServiceList.vue'

const services = useServiceStore()

// 初始是否渲染
const serviceUsed = ref<Set<string>>(new Set())

function changeWebView(service: Service) {
  // console.log(item.url)
  services.setActive({ serviceId: service.id })
  serviceUsed.value.add(service.id)
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
const drawer = ref(false)

const SETTING_HEIGHT = 45 * settings.length + 60
</script>

<template>
  <div class="home" flex>
    <div flex flex-col bg-hex-f0f2f5 pt-5px pb-3px>
      <div
        :style="{ height: `calc(100vh - ${SETTING_HEIGHT}px)` }" box-border
        overflow-hidden
      >
        <Sidebar
          v-model:services="services.displayServices" @add-service="drawer = true"
          @change="changeWebView"
        />
      </div>
      <Setting :settings="settings" />
    </div>
    <div class="w-100% h-100%">
      <div
        v-for="service in services.displayServices" v-show="service.isActive"
        :key="service.id" class="w-100% h-100%"
      >
        <ServiceView
          v-if="service.preload || service.isActive || serviceUsed.has(service.id)"
          :service="service"
          @set-webview="(webView) => (service._webview = webView)"
          @did-finish-load="() => { service.isLoading = false;service.isError = false; }"
          @did-fail-load="() => service.isError = true"
        />
      </div>
    </div>
  </div>
  <AddServiceDrawer v-model="drawer">
    <template #default="{ openInnerDrawer }">
      <ServiceList @handle-service="openInnerDrawer" />
    </template>
  </AddServiceDrawer>
</template>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100%;
}
</style>
