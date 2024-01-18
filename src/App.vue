<script setup lang="ts">
import { omit } from 'lodash-es'
import { useServiceStore } from './store/services'

const services = useServiceStore()

services.serviceMaintenanceTick()
services.$subscribe((mutation, state) => {
  if ((mutation.events as any)?.key !== 'teardown')
    localStorage.setItem('services', JSON.stringify({ allServices: state.allServices.map(s => omit(s, '_webview')) }))
})
</script>

<template>
  <RouterView />
</template>
