<script setup lang="ts">
import {useTokenStore} from '../stores/tokenStore'

let store = useTokenStore();
console.log(store.$state.storeToken);
const token = store.$state.storeToken;
</script>

<template>
  <main>
    {{token}}
  </main>
</template>