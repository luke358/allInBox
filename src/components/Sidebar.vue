<script lang='ts' setup>
import { computed, nextTick, ref } from 'vue'
import { useElementSize, useVModel } from '@vueuse/core'

import type { Service } from '../types'
import { getDomain } from '../utils'
import { useScrollTo } from '../composables/scroll'
import { useServiceStore } from '../store/services'

const props = defineProps<{ services: Service[] }>()
const emits = defineEmits(['change', 'addService', 'update:services'])
const serviceStore = useServiceStore()
const services = useVModel(props, 'services', emits)

const sideBarRef = ref<HTMLDivElement>()
const sideBarMenuRef = ref<HTMLDivElement>()

const { scrollBottom, scrollTop } = useScrollTo(sideBarMenuRef)
const { height } = useElementSize(sideBarRef)
const showArrow = computed(() => (services.value.length * 55 + 50) > height.value)

const popoverRefs = ref<HTMLElement[]>([])
function setPopoverRef(el: any | null, index: number) {
  if (el)
    popoverRefs.value[index] = el
}

const visibleServiceMenuRef = ref<Service | null>(null)
function handleMenu(service: Service, index: number) {
  visibleServiceMenuRef.value = service
  if (popoverRefs.value[index]) {
    nextTick(() => {
      popoverRefs.value[index].focus()
    })
  }
  // (popoverRefs.value[index] as HTMLDivElement).focus({ preventScroll: true })
}
</script>

<template>
  <div ref="sideBarRef" w-65px flex items-center flex-col class="h-100%">
    <div
      v-if="showArrow" cursor-pointer i-ic-round-keyboard-arrow-up h-30px
      w-30px bg-gray hover:bg-black @click="scrollTop"
    />
    <div ref="sideBarMenuRef" class="side-bar-menu w-100%" overflow-scroll flex-1>
      <el-popover
        v-for="(service, index) in services" :key="service.id"
        :visible="visibleServiceMenuRef?.id === service.id" placement="right-start"
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
              <div font-600 color-black>
                {{ service.name }}
              </div>
              <div class="i-carbon-update-now" cursor-pointer bg-hex-469398 mr-10px @click="serviceStore.reload({ serviceId: service.id })" />
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
          <div
            class="rd-50% w-100%" h-45px mb-10px flex items-center
            justify-center cursor-pointer relative
            @click="() => emits('change', service)"
            @contextmenu.prevent="handleMenu(service, index)"
          >
            <img
              w-30px h-30px
              :src="`https://api.iowen.cn/favicon/${getDomain(service.url)}.png`"
              alt=""
            >
            <div
              v-if="service.isActive"
              bg-hex-469398 absolute left-0 w-4px
              h-45px
            />
            <div
              v-if="service.unreadDirectMessageCount > 0"
              bg-hex-c95d55 absolute text-10px right-5px leading-15px top-0px px-4px h-15px text-center rounded-9999 text-white
            >
              {{ service.unreadDirectMessageCount }}
            </div>
            <span v-if="service.isHibernateEnabled && service.isHibernating" text-30px color-gray top--10px absolute left-5px>
              •
            </span>
          </div>
        </template>
      </el-popover>
    </div>
    <div
      v-if="showArrow" cursor-pointer i-ic-round-keyboard-arrow-down h-30px
      w-30px bg-gray hover:bg-black @click="scrollBottom"
    />
    <div mt-auto w-35px h-50px flex items-center justify-center flex-content-end>
      <div
        b="~ dashed" rd-5px hover:b-hex-469398 cursor-pointer
        @click="emits('addService')"
      >
        <div i-carbon-add w-30px h-30px hover:c-hex-469398 />
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-bar-menu::-webkit-scrollbar {
  display: none;
}
</style>
