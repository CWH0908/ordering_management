//检查用户信息（登录）
import axios from "axios"

//店铺登录
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

//店铺注册查询
export function register(account) {
  return axios.post("http://localhost:8081/shopRegister", {
    params: {
      account
    }
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}

//写入店铺注册数据
export function inputRegister(account, psw) {
  return axios.post("http://localhost:8081/shopInputRegister", {
    params: {
      account,
      psw
    }
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}
