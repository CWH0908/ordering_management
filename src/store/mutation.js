  const mutations = {
    //设置当前店铺信息（包含订单）
    set_currentShop(state, currentShop) {
      state.currentShop = currentShop;
    },

    //设置菜品列表
    set_foodList(state, foodList) {
      state.foodList = foodList;
    },

    //设置当前店铺的订单信息
    set_currentOrderData(state, newOrderArr) {
      state.currentOrderData = newOrderArr
    },

    //设置当前店铺基本信息（资料）
    set_currentShopBaseData(state, currentShopBaseData) {
      state.currentShopBaseData = currentShopBaseData
    },

    //设置是否有新的订单
    set_hasNewOrder(state, hasNewOrder) {
      state.hasNewOrder = hasNewOrder
    },

    //设置旧订单的长度
    set_oldLength(state, oldLength) {
      state.oldLength = oldLength
    },

    //设置未查看的订单数据
    set_newOrderData(state, newOrderData) {
      state.newOrderData = newOrderData
    },

    //设置有取消订单请求
    set_hasCancelOrder(state, hasCancelOrder) {
      state.hasCancelOrder = hasCancelOrder
    },
  }
  export default mutations;
