<template>
  <div class="dataStatistics">
    <full-page :options="options">
      <div class="section">
        <div class="box1">
          <barEcharts :bar_xAxis="allFoodArr" :hotSaleData="hotSaleData"></barEcharts>
        </div>
      </div>
      <div class="section">
        <div class="box2">
          <lineEcharts></lineEcharts>
        </div>
      </div>
      <div class="section">
        <div class="box3">
          <pieEcharts></pieEcharts>
        </div>
      </div>
    </full-page>
  </div>
</template>

<script>
import barEcharts from "../dataStatistics/barEcharts";
import lineEcharts from "../dataStatistics/lineEcharts";
import pieEcharts from "../dataStatistics/pieEcharts";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      options: {
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        afterLoad: this.afterLoad,
        scrollOverflow: true,
        scrollBar: false,
        menu: "#menu",
        sectionsColor: [
          // "#EBEEF5",
          // "#EBEEF5",
          // "#EBEEF5",
          // "#41b883",
          // "#ff5f45",
          // "#0798ec",
          // "#fec401",
          // "#1bcee6",
          // "#ee1a59",
          // "#2c3e4f",
          // "#ba5be9",
          // "#b4b8ab"
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["currentOrderData", "foodList"]),
    //返回店铺已有的所有菜品数组
    allFoodArr() {
      let newArr = [];
      this.foodList.forEach(item => {
        newArr.push(item.foodName);
      });
      return newArr;
    },
    //根据菜品名称，在该店铺的订单数据中检索对应的数量
    hotSaleData() {
      //首先根据菜品数组，创建一个菜品数组和对应销售量的对象数组
      console.log("currentOrder数据改变");
      let dataArr = [];
      this.foodList.forEach(foodItem => {
        let newObj = {};
        newObj.foodID = foodItem.foodID;
        newObj.foodName = foodItem.foodName;
        newObj.foodCount = 0; //初始化数量为0
        dataArr.push(newObj);
      });
      this.currentOrderData.forEach(orderItem => {
        orderItem.foodList.forEach(foodItem => {
          dataArr.forEach(dataItem => {
            if (dataItem.foodID == foodItem.foodData.foodID) {
              dataItem.foodCount += foodItem.foodCount;
            }
          });
        });
      });
      //从数据数组中抽离出销量
      let newArr = [];
      dataArr.forEach(item=>{
        newArr.push(item.foodCount)
      })
      return newArr
    }
  },
  components: {
    barEcharts,
    lineEcharts,
    pieEcharts
  }
};
</script>

<style lang="less" scoped>
/deep/ .fp-tableCell {
  padding: 8% 22%;
}
</style>