<script lang='ts' setup>
import type { Service } from '../types'
import WebViewLoad from './WebViewLoad.vue'
import WebViewError from './WebViewError.vue'
import WebViewEnable from './WebViewEnable.vue'
import WebViewHibernate from './WebViewHibernate.vue'
import WebView from './WebView.vue'

const { service } = defineProps<{ service: Service }>()

// const emits = defineEmits(['setWebview', 'didFinishLoad', 'didFailLoad'])
// const webViewRef = ref<ElectronWebView | null>(null)
</script>

<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden" relative>
    <WebViewHibernate v-if="service.isHibernateEnabled && service.isHibernating" :service="service" />
    <WebView
      v-show="!service.isLoading"
      v-else-if="service.enable"
      v-bind="$attrs" :service="service"
    />
    <WebViewEnable v-else-if="!service.enable" :service="service" />
    <WebViewError v-else-if="service.isError" :service="service" />
    <WebViewLoad v-else-if="service.isLoading" :service="service" />
  </div>
</template>

<style scoped></style>
