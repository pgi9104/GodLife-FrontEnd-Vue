<script setup lang="ts">
const props = defineProps(['gridId']);
</script>

<template>
  <div class="container gridTb" :id="gridId">
  </div>
</template>

<style>
.gridTb{
  overflow-x: auto;
  max-height: 70vh;
}
</style>