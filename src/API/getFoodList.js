import axios from "axios"
import {RemoteUrl} from "../API/RemoteServer"

export function getFoodList(shopID) {
  return axios.get(RemoteUrl+"home_foodList", {
    params: shopID
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
