import axios from "axios"
export function updateFoodList(foodID, foodItem) {
  return axios.get("http://localhost:8081/updateFoodList", {
    params: {
      foodID,
      foodItem
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}


export function deleteFoodItem(foodID) {
  return axios.get("http://localhost:8081/deleteFoodItem", {
    params: {
      foodID
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
