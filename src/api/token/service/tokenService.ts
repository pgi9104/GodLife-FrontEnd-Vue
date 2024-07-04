import axios from "axios";

const tokenApi = axios.create({
  baseURL: import.meta.env.VITE_APP_AUTH_URI,        // API 기본 호출 url
  timeout: 10 * 3000,                           // 10초 동안 요청 후 에러 처리
  headers: {
    "Content-type": "application/json",
  },
});

class TokenService {
  /**
   * 특정한 일시에 대한 주제를 조회
   * @params dateObj 특정 일자 객체
   * @returns 프로미스 객체
   */
  getToken(dateObj: {year: string, month: string, day: string}): Promise<any> {
    return tokenApi.get(`/api/letter/subject/year/${dateObj.year}/month/${dateObj.month}/day/${dateObj.day}`)
  }
}

export default new TokenService();