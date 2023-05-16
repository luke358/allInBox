<template>
  <div class="webViewContainer w-100% h-100%">
    <webview autosize id="foo" :src="src"
      style="display:inline-flex;" class="w-100% h-100%"></webview>
  </div>
</template>

<script lang='ts' setup>
defineProps({
  src: { type: String }
})
</script>
<style scoped></style>