import axios from "axios"
import {RemoteUrl} from "../API/RemoteServer"

//查询当前店铺的订单信息
export function getShopOrder(ShopID) {
  return axios.post(RemoteUrl+"getShopOrder", {
    params: {
      ShopID
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//更新订单状态信息到数据库
export function updateOrderState(orderItem, state) {
  return axios.post(RemoteUrl+"shopUpdateOrderState", {
    params: {
      orderItem,
      state
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
