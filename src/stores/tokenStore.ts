import { defineStore, mapActions } from 'pinia'

export const useTokenStore = defineStore('token', {
  state: () => {
    return { storeToken: '' }
  },
  getters: {
    token: (state) => state.storeToken,
  },
  actions: {
    createToken(token: string) {
      console.log("add Token: "+token);
      this.storeToken = token;
    }
  },
  persist: true,
});