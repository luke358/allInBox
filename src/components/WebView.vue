<script lang='ts' setup>
import type { ElectronWebView, Service } from '../types'

const { service } = defineProps<{ service: Service }>()
</script>

<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden">
    <webview
      :ref="(webviewRef) => {
        service._webview = webviewRef as unknown as ElectronWebView
      }" autosize :src="service.url"
      style="display:inline-flex;"
      class="w-100% h-100%" allowpopups
      webpreferences="spellcheck=1, contextIsolation=1`"
      :disablewebsecurity="true"
    />
  </div>
</template>

<style scoped></style>
