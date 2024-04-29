import { defineStore } from 'pinia'
import { AccessToken } from '../api/token/types/token'

export const useTokenStore = defineStore('token', {
  state: () => ({
    storeToken: null as AccessToken | null,
  }),
  getters: {
    getToken: (state) => {
      return state.storeToken;
    },
  },
  actions: {
    createToken(token: string): void{
      let access = new AccessToken(token);
      this.$state.storeToken = access;
    }
  }
});