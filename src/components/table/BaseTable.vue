<script setup lang="ts">
const props = defineProps(['gridId']);
</script>

<template>
  <div class="gridTb" :id="gridId">
  </div>
</template>

<style>
.gridTb {
  overflow-x: auto;
}
</style>