<template>
  <div class="webViewContainer w-100% h-100% overflow-hidden">
    <webview autosize :src="src" style="display:inline-flex;"
      class="w-100% h-100%" 
      allowpopups 
      webpreferences='spellcheck=1, contextIsolation=1`'
      :disablewebsecurity="true" />
  </div>
</template>

<script lang='ts' setup>
defineProps({
  src: { type: String }
})
</script>
<style scoped></style>