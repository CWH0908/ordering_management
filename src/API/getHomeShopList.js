import axios from "axios"
import {RemoteUrl} from "../API/RemoteServer"

//根据ID获取店铺信息
export function getHomeShoplist(shopID) {
  return axios.get(RemoteUrl+"home_shopList", {
    params: shopID
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}

//根据ID更新店铺信息
export function updateShopData(shopID,shopData) {
  return axios.get(RemoteUrl+"updateShopData", {
    params: {shopID,shopData}
  }).then(res => {
    return Promise.resolve(res.data[0]);
  });
}



