<script lang='ts' setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import type { ElectronWebView, Service } from '../types'
import WebViewLoad from './WebViewLoad.vue'
import WebViewError from './WebViewError.vue'

const { service } = defineProps<{ service: Service }>()

const emits = defineEmits(['setWebview', 'didFinishLoad', 'didFailLoad'])
const webViewRef = ref<ElectronWebView | null>(null)

const didFinishLoad = () => emits('didFinishLoad')
const didFailLoad = () => emits('didFailLoad')
onMounted(() => {
  webViewRef.value?.addEventListener('did-finish-load', didFinishLoad)
  webViewRef.value?.addEventListener('did-fail-load', didFailLoad)
})
onBeforeMount(() => {
  webViewRef.value?.removeEventListener('did-finish-load', didFinishLoad)
  webViewRef.value?.removeEventListener('did-finish-load', didFailLoad)
})
</script>

<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden" relative>
    <webview
      :ref="(_webviewRef) => {
        webViewRef = _webviewRef as unknown as ElectronWebView
        emits('setWebview', _webviewRef)
      }" autosize :src="service.url" style="display:inline-flex;"
      class="w-100% h-100%" allowpopups
      webpreferences="spellcheck=1, contextIsolation=1`"
      :disablewebsecurity="true"
    />
    <WebViewError v-if="service.isError" :service="service" />
    <WebViewLoad
      v-else-if="service.isLoading"
      :service="service"
    />
  </div>
</template>

<style scoped></style>
