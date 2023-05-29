<template>
  <div class="webViewContainer w-100% h-100%">
    <webview autosize :src="src" style="display:inline-flex;"
      class="w-100% h-100%" allowpopups plugins />
  </div>
</template>

<script lang='ts' setup>
defineProps({
  src: { type: String }
})
</script>
<style scoped></style>