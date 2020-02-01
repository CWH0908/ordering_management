<template>
  <div class="home">
    <div class="header">
      <topHeader></topHeader>
    </div>

    <div class="aside">
      <tab></tab>
    </div>

    <div class="body">
      <router-view name="foodAdmin"></router-view>
      <router-view name="orderAdmin"></router-view>
      <router-view name="typeAdmin"></router-view>
      <router-view name="shopInfoAdmin"></router-view>
      <router-view name="dataStatistics"></router-view>
    </div>

    <!-- <div class="newOrderTip" v-if="hasNewOrder&&currentRouter">
      <el-button type="success" class="newOrderTip" @click="goToOrderAdmin">新订单</el-button>
    </div>-->
  </div>
</template>

<script>
import tab from "../components/tab/tab";
import topHeader from "../components/topHeader/topHeader";
import { webSocketUrl } from "../API/webSocketUrl";
import { mapMutations, mapGetters } from "vuex";
import { getShopOrder } from "../API/getOrder";
import { getHomeShoplist } from "../API/getHomeShopList";

export default {
  components: {
    tab,
    topHeader
  },
  data() {
    return {
      websock: null, //用于初始化为一个webSocket实例
      requireData: "接收到服务端发送的数据:" //用于接收服务器返回的数据
    };
  },
  mounted() {
    //home页加载，创建webSocket连接
    this.initWebSocket();
  },
  destroyed() {
    //销毁组件，跳转路由时关闭webSocket连接
    this.websock.close();
  },
  computed: {
    ...mapGetters([
      "currentShop",
      "hasNewOrder",
      "currentOrderData",
      "oldLength"
    ])
  },
  methods: {
    ...mapMutations({
      set_hasNewOrder: "set_hasNewOrder",
      set_currentOrderData: "set_currentOrderData",
      set_newOrderData: "set_newOrderData",
      set_hasCancelOrder: "set_hasCancelOrder",
      set_currentShopBaseData: "set_currentShopBaseData"
    }),
    //请求数据库获取最新订单数据
    async _getShopOrder() {
      let orderData = await getShopOrder(this.currentShop.shopID);
      //更新vuex数据
      this.set_currentOrderData(orderData.reverse());
      //更新显示新的订单样式
      this.setNewOrder(orderData.length);
    },
    //获取店铺基本信息
    async _getHomeShoplist() {
      let temp = await getHomeShoplist(this.currentShop.shopID);
      this.set_currentShopBaseData(temp);
    },
    //新订单样式，传入参数为新的总数据长度
    setNewOrder(newLength) {
      this.set_newOrderData([]); //先将新订单数据置为空
      if (newLength - this.oldLength > 0) {
        //更新newOrder数据
        let newArr = [];
        for (let i = 0; i < this.currentOrderData.length; i++) {
          if (i < newLength - this.oldLength) {
            //小于新订单长度的都为新的订单
            newArr.push(this.currentOrderData[i]);
          }
        }
        this.set_newOrderData(newArr); //设置未查看的订单数据
      }
    },
    //连接到webSocket
    connectWebScket() {
      this.initWebSocket();
    },
    //关闭连接
    closeConnect() {
      this.websock.close();
    },
    initWebSocket() {
      //初始化weosocket
      // 以    ws://服务器地址/webSocket  路由的形式建立连接
      this.websock = new WebSocket(webSocketUrl + this.currentShop.shopID);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    //连接建立之后执行send方法发送数据
    websocketonopen() {
      let actions = {
        shopID: "00000"
      };
      this.websocketsend(JSON.stringify(actions));
    },
    //连接建立失败重连
    websocketonerror() {
      this.initWebSocket();
    },
    //接收服务端数据
    websocketonmessage(e) {
      const redata = e.data;
      this.requireData = this.requireData + "\n" + redata;
      console.log("接收到服务端发送的数据：", redata);
      if (redata == "有新订单") {
        this.set_hasNewOrder(true); //将是否有新订单的vuex数据置为true
      } else {
        this.set_hasNewOrder(false);
      }
      if (redata == "收到取消订单申请") {
        this.set_hasCancelOrder(true); //将是否有取消订单请求的vuex数据置为true
      } else {
        this.set_hasCancelOrder(false);
      }
      if (redata == "销量更新") {
        console.log("销量更新，重新请求数据库")
        this._getShopOrder();//重新请求订单数据
      }
    },
    //客户端发送数据
    websocketsend(Data) {
      this.websock.send(Data);
    },
    //关闭webSocket连接
    websocketclose(e) {
      console.log("关闭webSocket连接：", e);
    }
    //跳转到订单页面
    // goToOrderAdmin() {
    //   this.$router.push({
    //     name: "orderAdmin"
    //   });
    //   this.set_hasNewOrder(false); //跳转后将值置为false
    // }
  },
  watch: {
    //如果当前路由是订单列表，按钮则不显示
    // $route(to, from) {
    //   if(to.path=="main/home/orderAdmin"){
    //     this
    //   }
    // }
    hasNewOrder(newVal) {
      if (newVal) {
        console.log("有新订单，重新请求数据库");
        this._getShopOrder();
        this._getHomeShoplist();
        this.$message({
          message: "接到新的订单",
          type: "success"
        });
        setTimeout(() => {
          this.set_hasNewOrder(false); //请求后将值置为false
          this.isShowNewOrderTip = true;
        }, 3000);
      }
    },
    hasCancelOrder(newVal) {
      if (newVal) {
        console.log("有新的订单进度，重新请求数据库");
        this._getShopOrder();
        this._getHomeShoplist();
        this.$message({
          message: "有新的订单进度",
          type: "info"
        });
        setTimeout(() => {
          this.set_hasCancelOrder(false); //请求后将值置为false
        }, 3000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  .header {
    z-index: 999;
    position: fixed;
    width: 100%;
    top: 0;
  }
  .aside {
    position: fixed;
    top: 8vh;
    float: left;
    height: 92vh;
    background-color: #545c64;
  }
  .body {
    overflow: hidden;
    padding-left: 15vw;
    padding-top: 8vh;
    // background-color: #67c23a;
  }
  .newOrderTip {
    position: fixed;
    bottom: 5rem;
    right: 1rem;
  }
}
</style>