import axios from "axios";
import { useTokenStore } from "@/stores/tokenStore";
import { useUserStore } from "@/stores/userStore";
import { User } from "../types/user";

class userService {
  /**
   * 특정한 일시에 대한 주제를 조회
   * @returns 프로미스 객체
   */
  getUserInfo(): Promise<any> {
    return axios({
      method: 'post',
      url: 'http://localhost:8080/api/userinfo',
      headers: {
        "Content-type": "application/json",
        "Authorization": useTokenStore().storeToken?.getToken(),
      },
    })
    .then((res) => {
      console.log(res.data);
      let user = res.data;
      let userId: string = user.userId;
      let username: string = user.username;
      let email: string = user.email;
      useUserStore().createUser(new User(userId, username, email) as User);
      //console.log(useUserStore().storeUser);
    });
  }
}

export default new userService();