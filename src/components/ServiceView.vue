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
    <WebViewEnable v-if="!service.enable" :service="service" />
    <WebViewHibernate v-else-if="service.isHibernateEnabled && service.isHibernating" :service="service" />
    <WebView
      v-else
      v-show="!service.isLoading"
      v-bind="$attrs" :service="service"
    />
    <template v-if="service.enable && !(service.isHibernateEnabled && service.isHibernating)">
      <WebViewLoad v-if="service.isLoading " :service="service" />
      <WebViewError v-else-if="service.isError" :service="service" />
    </template>
  </div>
</template>

<style scoped></style>
