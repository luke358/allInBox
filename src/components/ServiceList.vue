<script lang="ts" setup>
import { useServiceStore } from '../store/services'

const emits = defineEmits(['handleService'])
const services = useServiceStore()
</script>

<template>
  <div grid="~ cols-4">
    <el-popover
      v-for="service in services.displayServices" :key="service.id"
      placement="top-start" :title="service.name" :width="200" trigger="hover"
      :content="`this is service ${service.name}`"
    >
      <template #reference>
        <div
          hover:bg-gray-100 cursor-pointer p5px rd-5px flex justify-center
          items-center
          @click="emits('handleService', service)"
        >
          <img w-40px h-40px src="../assets/vite.svg" alt="">
          <div max-w-100px text-truncate ml-10px>
            {{ service.name }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
