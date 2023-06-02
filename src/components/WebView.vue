<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden">
    <webview autosize :src="service.url" style="display:inline-flex;"
    :ref="(webviewRef) => {
      service._webview = webviewRef as unknown as ElectronWebView
    }"
      class="w-100% h-100%" allowpopups
      webpreferences='spellcheck=1, contextIsolation=1`'
      :disablewebsecurity="true" />
  </div>
</template>

<script lang='ts' setup>
import { ElectronWebView, Service } from '../types';

const { service } = defineProps<{ service: Service }>()

</script>
<style scoped></style>