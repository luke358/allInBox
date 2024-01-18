<script lang='ts' setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ElectronWebView, Service } from '../types'
import { useServiceStore } from '../store/services'

const { service } = defineProps<{ service: Service }>()
const emits = defineEmits(['setWebview', 'didFinishLoad', 'didFailLoad'])
const services = useServiceStore()
const webViewRef = ref<ElectronWebView | null>(null)

const didFinishLoad = () => emits('didFinishLoad')
const didFailLoad = () => emits('didFailLoad')
onMounted(() => {
  webViewRef.value?.addEventListener('did-finish-load', didFinishLoad)
  webViewRef.value?.addEventListener('did-fail-load', didFailLoad)
  webViewRef.value?.addEventListener('media-started-playing', () => services.didMediaPlaying({ serviceId: service.id }))
  webViewRef.value?.addEventListener('media-paused', () => services.didMediaPaused({ serviceId: service.id }))
  webViewRef.value?.addEventListener('dom-ready', () => {
    console.log('dom-ready')
    webViewRef.value?.openDevTools()
  })
  console.log(webViewRef.value)
  webViewRef.value?.addEventListener('ipc-message', (e: any) => {
    console.log('ipc-message')
    if (e.channel === 'data') {
      console.log(e)
    }
  })
})
onBeforeUnmount(() => {
  webViewRef.value?.removeEventListener('did-finish-load', didFinishLoad)
  webViewRef.value?.removeEventListener('did-finish-load', didFailLoad)
  webViewRef.value?.removeEventListener('media-started-playing', () => services.didMediaPlaying({ serviceId: service.id }))
  webViewRef.value?.removeEventListener('media-paused', () => services.didMediaPaused({ serviceId: service.id }))
})
</script>

<template>
  <webview :ref="(_webviewRef: ElectronWebView) => {
    webViewRef = _webviewRef as unknown as ElectronWebView
    emits('setWebview', _webviewRef)
  }" autosize :src="service.url" style="display:inline-flex;"
    class="w-100% h-100%" allowpopups nodeintegration
    webpreferences="spellcheck=1, contextIsolation=1, sandbox=false" :disablewebsecurity="true"
    :partition="service.id" />
</template>
 
<style scoped>
</style>
