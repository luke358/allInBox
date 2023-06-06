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
    Webview happen error, click
    <el-button @click="services.reload({ serviceId: service.id })">
      reload
    </el-button> to reload
  </div>
</template>

<style scoped></style>
