  const mutations = {
    //设置当前店铺信息
    set_currentShop(state, currentShop) {
      state.currentShop = currentShop;
    },

    //设置菜品列表
    set_foodList(state, foodList) {
      state.foodList = foodList;
    }
  }
  export default mutations;
