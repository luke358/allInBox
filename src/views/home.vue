<script setup lang="ts">
import { ref } from 'vue';
import WebView from '../components/WebView.vue'
import { useServiceStore } from '../store/services';
import { Service } from '../types';
const services = useServiceStore()
const changeWebView = (service: Service) => {
  // console.log(item.url)
  services.setActive({serviceId: service.id})
  urlRendered.value.add(service.id)
}
// const services = [
//   { src: 'https://mail.google.com/mail', name: 'Gmail' },
//   { src: 'https://twitter.com/', name: 'Twitter' },
//   { src: 'https://github.com/', name: 'Github' },
//   { src: 'https://www.aliyundrive.com/drive', name: '阿里云盘' },
//   // preload 初始强制加载
//   { src: 'https://discord.com/app', preload: true, name: 'Discord' },
//   { src: 'https://web.telegram.org/a/', preload: true, name: 'Telegram' },
// ]

const getDomain = (sourceUrl: string | undefined) => {
  if (!sourceUrl) return sourceUrl
  const url = new URL(sourceUrl);
  const domain = url.hostname.split('.').slice(-2).join('.');
  return domain
}
// 初始是否渲染
const urlRendered = ref<Set<string>>(new Set())
</script>

<template>
  <div class="home" flex>
    <div flex flex-col bg-hex-f0f2f5 pt-10px>
      <div class="h-60%" w-65px flex items-center flex-col>
        <div v-for="item in services.displayServices" class="rd-50%" mb-10px w-45px
          h-45px flex items-center justify-center
          @click="() => changeWebView(item)">
          <img w-30px h-30px
            :src="`https://api.iowen.cn/favicon/${getDomain(item.url)}.png`"
            alt="">
          <div v-if="item.isActive" bg-hex-469398
            absolute left-0 w-4px h-45px></div>
        </div>
      </div>
      <div flex-1 w-65px>
      </div>
    </div>
    <div class="w-100% h-100%">
      <div class="w-100% h-100%" v-show="service.isActive"
        v-for="service in services.displayServices">
        <WebView :service="service"
          v-if="service.preload || urlRendered.has(service.id)" />
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
