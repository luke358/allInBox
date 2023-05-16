<script setup lang="ts">
import { ref } from 'vue';
import WebView from '../components/WebView.vue'

const changeWebView = (item: any) => {
  console.log(item.src)
  activeSrc.value = item.src
  if (getDomain(item.src))
    urlRendered.value.add(getDomain(item.src)!)
}
const urls = [
  { src: 'https://www.baidu.com' },
  { src: 'https://github.com/electron/electron-quick-start' },
  { src: 'https://www.aliyundrive.com/drive' },
  // preload 初始强制加载
  { src: 'https://discord.com/app', preload: true },
]
const activeSrc = ref()

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
    <div flex flex-col class="bg-#f0f2f5" pt-10px>
      <div class="h-60%" w-65px flex items-center flex-col>
        <div v-for="item in urls" class="rd-50%" mb-10px w-45px h-45px flex
          items-center justify-center @click="() => changeWebView(item)">
          <img class="w-30px h-30px"
            :src="`https://api.iowen.cn/favicon/${getDomain(item.src)}.png`"
            alt="">
          <div v-if="getDomain(item.src) === getDomain(activeSrc)"
            class="bg-#469398" absolute left-0 w-4px h-45px></div>
        </div>
      </div>
      <div flex-1 w-65px>
      </div>
    </div>
    <div class="w-100% h-100%">
      <div class="w-100% h-100%"
        v-show="getDomain(item.src) === getDomain(activeSrc)"
        v-for="item in urls">
        <WebView :src="item.src" v-if="item.preload || urlRendered.has(getDomain(item.src)!)"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: calc(100vh - 33px);
}
</style>
