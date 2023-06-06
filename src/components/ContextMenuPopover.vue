<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import type { Service } from '../types'

const props = defineProps<{ services: Service[]; visible: boolean }>()
const emit = defineEmits(['update:visible'])
const visible = useVModel(props, 'visible', emit)

const popoverRefs = ref<HTMLElement[]>([])
function setPopoverRef(el: any | null, index: number) {
  if (el)
    popoverRefs.value[index] = el
}

const visibleServiceMenuRef = ref<Service | null>(null)
// eslint-disable-next-line unused-imports/no-unused-vars
function handleMenu(service: Service, index: number) {
  visibleServiceMenuRef.value = service
  if (popoverRefs.value[index]) {
    nextTick(() => {
      popoverRefs.value[index].focus()
    })
  }
}
</script>

<template>
  <el-popover
    v-for="(service, index) in services" :key="service.id"
    :visible="visible" placement="right-start"
    :width="200"
  >
    <template #default>
      <div
        :ref="(el: any) => setPopoverRef(el, index)"
        :tabindex="index"
        focus:outline-none
        @blur="visibleServiceMenuRef = null"
      >
        <div flex justify-between mb-10px>
          <div>{{ service.name }}</div>
          <div> Reload </div>
        </div>
        <div>
          <div flex justify-between items-center>
            <div>Enabled:</div>
            <el-switch v-model="service.enable" />
          </div>
          <div flex justify-between items-center>
            <div>Sound:</div>
            <el-switch v-model="service.isSoundsEnabled" />
          </div>
          <div flex justify-between items-center>
            <div>Notification:</div>
            <el-switch v-model="service.isNotificationEnabled" />
          </div>
          <div flex justify-center mt-5px>
            <el-button class="bg-hex-469398! c-white! w-100%">
              Settings
            </el-button>
          </div>
        </div>
      </div>
    </template>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>
