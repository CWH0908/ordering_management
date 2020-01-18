import axios from "axios"

//查询当前店铺的订单信息
export function getShopOrder(ShopID) {
  return axios.post("http://localhost:8081/getShopOrder", {
    params: {
      ShopID
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//更新订单状态信息到数据库
export function updateOrderState(orderItem, state) {
  return axios.post("http://localhost:8081/shopUpdateOrderState", {
    params: {
      orderItem,
      state
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
