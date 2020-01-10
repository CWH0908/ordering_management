import axios from "axios"

//更新菜品
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

//删除菜品
export function deleteFoodItem(foodID) {
  return axios.get("http://localhost:8081/deleteFoodItem", {
    params: {
      foodID
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//新增菜品
export function insertFoodItem(foodItem) {
  return axios.get("http://localhost:8081/insertFoodItem", {
    params: {
      foodItem
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//修改菜品类型
export function modifyFoodType(newTypeArr) {
  return axios.get("http://localhost:8081/modifyFoodType", {
    params: {
      newTypeArr
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

//移除菜品分类及其菜品分类
export function removeFoodType(foodType) {
  return axios.get("http://localhost:8081/removeFoodType", {
    params: {
      foodType
    }
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
