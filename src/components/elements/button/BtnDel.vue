<script setup lang="ts">
import BaseBtn from './BaseBtn.vue';
import { msgStore } from '@/stores/msgStore'
const btnName = msgStore().globalMsg.getCodeValue('COMM.BTN.DEL');
</script>

<template>
  <BaseBtn :btn-name="btnName"></BaseBtn>
</template>

<style>
</style>