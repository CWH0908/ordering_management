  const mutations = {
    //设置当前店铺信息（包含订单）
    set_currentShop(state, currentShop) {
      state.currentShop = currentShop;
    },

    //设置菜品列表
    set_foodList(state, foodList) {
      state.foodList = foodList;
    },

    //设置当前店铺基本信息（资料）
    set_currentShopBaseData(state, currentShopBaseData) {
      state.currentShopBaseData = currentShopBaseData
    }
  }
  export default mutations;
