import axios from "axios"
import {RemoteUrl} from "../API/RemoteServer"

//更新菜品
export function updateFoodList(foodID, foodItem) {
  return axios.get(RemoteUrl+"updateFoodList", {
    params: {
      foodID,
      foodItem
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//删除菜品
export function deleteFoodItem(foodID) {
  return axios.get(RemoteUrl+"deleteFoodItem", {
    params: {
      foodID
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//新增菜品
export function insertFoodItem(foodItem) {
  return axios.get(RemoteUrl+"insertFoodItem", {
    params: {
      foodItem
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//修改菜品类型
export function modifyFoodType(newTypeArr) {
  return axios.get(RemoteUrl+"modifyFoodType", {
    params: {
      newTypeArr
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//移除菜品分类及其菜品分类
export function removeFoodType(foodType) {
  return axios.get(RemoteUrl+"removeFoodType", {
    params: {
      foodType
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
