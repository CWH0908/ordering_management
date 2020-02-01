//检查用户信息（登录）
import axios from "axios"
import {RemoteUrl} from "../API/RemoteServer"

//店铺登录
export function login(account, psw) {
  return axios.get(RemoteUrl+"shopLogin", {
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
  return axios.post(RemoteUrl+"shopRegister", {
    params: {
      account
    }
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}

//写入店铺注册数据
export function inputRegister(account, psw) {
  return axios.post(RemoteUrl+"shopInputRegister", {
    params: {
      account,
      psw
    }
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}
