<script lang='ts' setup>
import { useServiceStore } from '../store/services'
import type { Service } from '../types'

defineProps<{ service: Service }>()
const services = useServiceStore()
</script>

<template>
  <div
    class="webViewContainer w-100% h-100% overflow-hidden" absolute top-0 left-0
    bottom-0 right-0
    flex
    items-center
    justify-center
  >
    Webview had hibernate, click
    <el-button @click="services.awake({ serviceId: service.id })">
      Wake up
    </el-button> to Wake up
  </div>
</template>

<style scoped></style>
