<script setup lang="ts">
import { useServiceStore } from './store/services'

useServiceStore().serviceMaintenanceTick()
</script>

<template>
  <RouterView />
</template>
