<script setup lang="ts">
import BaseBtn from './BaseBtn.vue';
import { msgStore } from '@/stores/msgStore'
</script>

<template>
  <BaseBtn :btn-name="msgStore().globalMsg.getCodeValue('COMM.BTN.ADD')"></BaseBtn>
</template>

<style>
</style>