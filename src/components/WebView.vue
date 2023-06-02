<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import type { ElectronWebView, Service } from '../types'
import WebViewLoad from './WebViewLoad.vue'

const { service } = defineProps<{ service: Service }>()

const emits = defineEmits(['setWebview', 'didFinishLoad', 'didFailLoad'])
const webViewRef = ref<ElectronWebView | null>(null)
onMounted(() => {
  webViewRef.value?.addEventListener('did-finish-load', () => emits('didFinishLoad'))
  webViewRef.value?.addEventListener('did-fail-load', () => emits('didFailLoad'))
})
</script>

<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden">
    <webview
      :ref="(_webviewRef) => {
        webViewRef = _webviewRef as unknown as ElectronWebView
        emits('setWebview', _webviewRef)
      }" autosize :src="service.url" style="display:inline-flex;"
      class="w-100% h-100%" allowpopups
      webpreferences="spellcheck=1, contextIsolation=1`"
      :disablewebsecurity="true"
    />
    <WebViewLoad :service="service" />
  </div>
</template>

<style scoped></style>
