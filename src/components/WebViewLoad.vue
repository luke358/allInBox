<script lang='ts' setup>
import type { Service } from '../types'

defineProps<{ service: Service }>()
</script>

<template>
  <div
    class="webViewContainer w-100% h-100% overflow-hidden" absolute top-0 left-0
    bottom-0 right-0
    flex
    items-center
    justify-center
  >
    Loading
  </div>
</template>

<style scoped></style>
