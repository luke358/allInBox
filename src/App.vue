<script setup lang="ts">
import { ref } from 'vue';
import WebView from './components/WebView.vue';

const changeWebView = (item: any) => {
  console.log(item.src)
  activeSrc.value = item.src
}
const urls = [
  {src: 'https://www.baidu.com'},
  {src: 'https://github.com/electron/electron-quick-start'},
]
const activeSrc = ref()
console.log("[App.vue]", `Hello world from Electron ${process.versions.electron}!`)
</script>

<template>
  <div class="h-100vh w-100vw" flex>
    <div w-80px flex>
      <div w-80px flex items-center flex-col>
        <div v-for="item in urls" w-50px h-50px bg-red class="rd-50%" @click="() => changeWebView(item)"></div>
      </div>
      <div></div>
    </div>
    <WebView :src="activeSrc"/>
  </div>
</template>

<style></style>
