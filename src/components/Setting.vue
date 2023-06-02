<script lang='ts' setup>
defineProps<{ settings: { icon: string }[] }>()
</script>

<template>
  <div :style="{ height: `${45 * settings.length + 60}px` }">
    <div v-for="setting in settings" :key="setting.icon" h-45px cursor-pointer>
      <div
        h-45px w-45px m-auto hover:bg-gray-2 flex justify-center items-center
        class="rd-50%"
      >
        <div w-23px h-23px :class="`text-#555 ${setting.icon}`" />
      </div>
    </div>
    <div h-60px class="text-#555" flex justify-center items-center>
      <img
        src="https://lh3.googleusercontent.com/a/AAcHTtffZDHYUCkzYhwhsbQTTFk-FVh1F72CakNmwB-r=s192-c-br100-rg-mo"
        class="w-40px h-40px"
      >
    </div>
  </div>
</template>

<style scoped></style>
