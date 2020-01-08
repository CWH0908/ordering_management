//检查用户信息（登录）
import axios from "axios"

//用户登录
export function login(account, psw) {
  return axios.get("http://localhost:8081/shopLogin", {
    params: {
      account,
      psw
    }
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}
