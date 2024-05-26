<script setup lang="ts">
import LoginForm from '@/components/header/login/LoginForm.vue'
const props = defineProps(['title']);
</script>

<template>
  <div class="brand col-11">
    <a class="navbar-brand" href="#"> <label>{{ title }}</label></a>
  </div>
  <div class="col-1">
    <LoginForm></LoginForm>
  </div>
</template>

<style>
@media (min-width: 360px) {
  /* 모바일 */
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

@media (min-width: 768px) {
  /* 테블릿 */
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

@media (min-width: 1024px) {
  /* 데스크탑 */
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>