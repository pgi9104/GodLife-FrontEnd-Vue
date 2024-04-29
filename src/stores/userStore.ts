import { defineStore } from 'pinia'
import { User , AbstractUser} from '@/api/user/types/user'
import { ref } from 'vue';

export const useUserStore = defineStore('user', {
  state: () => ({
    storeUser: {}
  }),
  getters: {
    getUser: (state) => {
      return state.storeUser;
    },
  },
  actions: {
    createUser(user: User): void{
      this.storeUser = user;
    }
  }
});