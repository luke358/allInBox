<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { defineModel, ref } from 'vue'
import type { Service } from '../types'

const modelValue = defineModel<boolean>('modelValue', { default: false })

const innerDrawer = ref(false)
const service = ref<Service | null>(null)
function openInnerDrawer(s: Service) {
  innerDrawer.value = true
  service.value = s
}
</script>

<template>
  <el-drawer
    v-bind="$attrs" v-model="modelValue" title="添加服务" size="80%"
    class="top-28px!"
  >
    <div>
      <slot :open-inner-drawer="openInnerDrawer" />
      <el-drawer
        v-model="innerDrawer" class="top-28px!" :title="service?.name"
        :append-to-body="true"
        size="50%"
      >
        <p>_(:зゝ∠)_</p>
      </el-drawer>
    </div>
  </el-drawer>
</template>
