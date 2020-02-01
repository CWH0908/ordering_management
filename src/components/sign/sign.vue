<template>
  <div class="sign">
    <div class="container">
      <h3>订餐系统-商家登录</h3>
      <transition appear mode="out-in">
        <div class="signBox">
          <el-input
            prefix-icon="el-icon-user"
            class="input"
            placeholder="请输入账号"
            v-model="inputAccount"
            clearable
          ></el-input>
          <el-input
            show-password
            class="input"
            prefix-icon="el-icon-edit-outline"
            placeholder="请输入密码"
            v-model="inputPwd"
            clearable
          ></el-input>
          <div class="opration">
            <!-- <span class="forgetButon">忘记密码</span> -->
            <el-button
              class="sign-up-button"
              type="primary"
              @click="shopRegister"
            >注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
            <el-button
              class="sign-in-button"
              type="primary"
              @click="shopLogin"
            >登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { login, register, inputRegister } from "../../API/shopRequire";
import { mapMutations } from "vuex";
import { getFoodList } from "../../API/getFoodList";
import { getShopOrder } from "../../API/getOrder";

export default {
  data() {
    return {
      inputAccount: "",
      inputPwd: "",
      shopData: {}
    };
  },
  methods: {
    ...mapMutations({
      set_currentShop: "set_currentShop",
      set_foodList: "set_foodList",
      set_currentOrderData: "set_currentOrderData",
      set_oldLength: "set_oldLength"
    }),
    shopLogin() {
      this._shopLogin();
    },
    async _shopLogin() {
      if (this.inputAccount != "" && this.inputPwd != "") {
        let temp = await login(this.inputAccount, this.inputPwd);
        if (temp) {
          this.shopData = temp;
          this.set_currentShop(temp); //将从数据库中返回的数据保存在vuex中

          //根据得到的店铺信息，请求其菜品信息
          this._getFoodList(temp.shopID);

          const toast = Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: "正在登录 3 秒"
          });

          let second = 3;
          const timer = setInterval(() => {
            second--;
            if (second) {
              toast.message = `正在登录 ${second} 秒`;
            } else {
              clearInterval(timer);
              // 手动清除 Toast
              Toast.clear();
            }
          }, 1000);
          const routerTimer = setTimeout(() => {
            this.$router.push({ path: "/main/home/foodAdmin" });
          }, 3000);
        } else {
          Toast("账号密码错误");
        }
      } else {
        Toast("请输入账号密码");
      }
    },
    //请求菜品
    async _getFoodList(shopID) {
      let temp = await getFoodList(shopID);
      this.set_foodList(temp);
      //确定了用户身份后，根据shopID去order_datas文档查找属于该店铺的订单
      let orderData = await getShopOrder(shopID);
      // debugger
      this.set_currentOrderData(orderData.reverse());
      this.set_oldLength(orderData.length); //一登录即设置最初的订单长度
    },

    //商家注册
    shopRegister() {
      this._shopRegister();
    },
    async _shopRegister() {
      // Toast("商家注册");
      if (this.inputAccount != "" && this.inputPwd != "") {
        let temp = await register(this.inputAccount);
        console.log("查找回来的数据temp", temp);
        if (temp) {
          Toast("该账号已注册");
        } else {
          await inputRegister(this.inputAccount, this.inputPwd);
          //写入注册的账号密码到数据库
          Toast("注册成功");
        }
      } else {
        Toast("请完善账号密码");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sign {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#0091fc), to(#b0c4de));
  .container {
    width: 20rem;
    height: 17rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    h3 {
      font-size: 1.5rem;
      color: white;
      padding: 1rem 0;
    }
    .signBox {
      width: 100%;
      height: 12rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      // background-color: rgba(0, 0, 0, 0.5);
      border-radius: 20px;
      .input {
        width: 90%;
        display: block;
        margin: 0 auto;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .opration {
        display: flex;
        justify-content: space-between;
        margin: 0 1rem;
        .sign-up-button {
          height: 2.5rem;
          display: inline-block;
          text-align: center;
          border-radius: 20px;
          // margin-right: 6.8rem;
        }
        .sign-in-button {
          height: 2.5rem;
          display: inline-block;
          text-align: center;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>