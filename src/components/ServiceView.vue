<script lang='ts' setup>
import type { Service } from '../types'
import WebViewError from './WebViewError.vue'
import WebViewEnable from './WebViewEnable.vue'
import WebViewHibernate from './WebViewHibernate.vue'
import WebView from './WebView.vue'

const { service } = defineProps<{ service: Service }>()
</script>

<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden" relative>
    <WebViewHibernate v-if="service.isHibernateEnabled && service.isHibernating" :service="service" />
    <WebView
      v-show="!service.isLoading"
      v-else-if="service.enable"
      v-bind="$attrs" :service="service"
    />
    <WebViewEnable v-else :service="service" />

    <WebViewLoad v-if="service.isLoading" :service="service" />
    <WebViewError v-else-if="service.isError" :service="service" />
  </div>
</template>

<style scoped></style>
