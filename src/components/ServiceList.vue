<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { createInitialService, getDomain } from '../utils'
import { getServiceList } from '../api/v1'
import type { Service } from '../types'

const emits = defineEmits(['handleService'])
const services = ref<Service[]>([])
onMounted(async () => {
  services.value = (await getServiceList() || []).map(service => ({ ...createInitialService(false), ...service }))
})
</script>

<template>
  <div grid="~ cols-4 gap-20px">
    <el-popover
      v-for="service in services" :key="service.id"
      placement="bottom-start" :title="service.name" :width="200" trigger="hover"
      :content="`this is service ${service.name}`"
    >
      <template #reference>
        <div
          hover:bg-gray-100 cursor-pointer pl-20px pr-8px py-15px rd-5px flex items-center
          @click="emits('handleService', service)"
        >
          <img
            w-40px h-40px
            :src="`https://api.iowen.cn/favicon/${getDomain(service.url)}.png`"
            alt=""
          >
          <div max-w-100px text-truncate ml-10px>
            {{ service.name }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
