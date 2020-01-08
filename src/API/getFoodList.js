import axios from "axios"
export function getFoodList(shopID) {
  return axios.get("http://localhost:8081/home_foodList", {
    params: shopID
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
