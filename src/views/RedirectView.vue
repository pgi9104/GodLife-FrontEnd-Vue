<template>
</template>
<script lang="ts">
import { useTokenStore } from '../stores/tokenStore'


export default {
  created () {
    // 컴포넌트 렌더링이 되었을 때,
    
    // 쿼리스트링으로부터 토큰을 획득
    const token = this.$route.query.token;
    let store = useTokenStore();

    // 토큰이 존재하는 경우, Vuex Store에 토큰을 저장한다.
    if (token) {
      store.$patch({ storeToken: token as string});
      //userService.getUserInfo();
    }

    // 토큰이 있던 없던, 루트 페이지로 이동한다.
    this.$router.replace('/')
  },
}
</script>