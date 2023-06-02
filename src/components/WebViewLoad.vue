<script lang='ts' setup>
import type { Service } from '../types'

defineProps<{ service: Service }>()
</script>

<template>
  <div v-if="service.isLoading" absolute class="webViewContainer w-100% h-100% overflow-hidden">
    Loading
  </div>
</template>

<style scoped></style>
