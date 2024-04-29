<script setup lang="ts">
import {useTokenStore} from '../stores/tokenStore'

console.log(useTokenStore().$state.storeToken);

</script>

<template>
  <main>
    hello
  </main>
</template>