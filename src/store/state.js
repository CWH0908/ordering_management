//state 代表状态，把需要存储的数据定义在这里
const state = {
  currentShop: {}, //定义店铺信息对象
  foodList: [], //当前店铺的菜品列表
  mallTypeArr: ["Noodles", "Popular", "Fruit", "Drinks", "Barbecue", "Hamburger"], //商家类型
  currentShopBaseData: {}, //当前店铺基本信息
  hasNewOrder: false, //是否有新的订单
  hasCancelOrder: false, //是否有取消订单请求
  currentOrderData: [], //店铺的订单信息
  // newLength:0,//最新订单数据的长度
  oldLength: 0, //旧订单数据的长度
  newOrderData: [], //未查看的订单数据
}

export default state;
