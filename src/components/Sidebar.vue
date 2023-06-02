<script lang='ts' setup>
import { computed, ref } from 'vue'
import type { Service } from '../types'
import { getDomain } from '../utils'
import { useScrollTo } from '../composables/scroll'

const { services } = defineProps<{ services: Service[] }>()
const emits = defineEmits(['change'])
const sideBarRef = ref<HTMLDivElement>()
const sideBarMenuRef = ref<HTMLDivElement>()

const { scrollBottom, scrollTop } = useScrollTo(sideBarMenuRef)

const showArrow = computed(() => (services.length * 55 + 50) > (sideBarRef.value?.clientHeight || 0))
</script>

<template>
  <div ref="sideBarRef" w-65px flex items-center flex-col class="h-100%">
    <div
      v-if="showArrow" cursor-pointer i-ic-round-keyboard-arrow-up
      h-30px w-30px bg-gray hover:bg-black @click="scrollTop"
    />
    <div ref="sideBarMenuRef" class="side-bar-menu" overflow-scroll flex-1>
      <div
        v-for="service in services" class="rd-50%" mb-10px w-45px h-45px flex
        items-center justify-center cursor-pointer
        @click="() => emits('change', service)"
      >
        <img
          w-30px h-30px
          :src="`https://api.iowen.cn/favicon/${getDomain(service.url)}.png`"
          alt=""
        >
        <div v-if="service.isActive" bg-hex-469398 absolute left-0 w-4px h-45px />
      </div>
    </div>
    <div
      v-if="showArrow" cursor-pointer i-ic-round-keyboard-arrow-down
      h-30px w-30px bg-gray hover:bg-black @click="scrollBottom"
    />
    <div mt-auto w-35px h-50px flex items-center justify-center flex-content-end>
      <div b="~ dashed" rd-5px hover:b-hex-469398 cursor-pointer>
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
