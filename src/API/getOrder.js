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
