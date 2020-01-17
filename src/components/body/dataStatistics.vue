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
          <lineEcharts :getRecentlyDay="getRecentlyDay" :saleMoneyData="saleMoneyData"></lineEcharts>
        </div>
      </div>
      <div class="section">
        <div class="box3">
          <pieEcharts :foodTypeArr="foodTypeArr" :saleTypeData="saleTypeData"></pieEcharts>
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
      },
      seriesDayMoney: [], //保存与数据库格式一致的近15天的日期的营业额
      foodTypeData: [] //保存与数据库格式一致的菜品分类销售量
    };
  },
  computed: {
    ...mapGetters(["currentOrderData", "foodList"]),
    //柱状图数据***************************************************
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
      dataArr.forEach(item => {
        newArr.push(item.foodCount);
      });
      return newArr;
    },

    // 折线图数据***************************************************
    // 获取当前日期前15天的日期用于传入折线图作为x轴
    getRecentlyDay() {
      let n = 15;
      let dayArr = []; //存储15天日期
      for (let i = n; i >= 1; i--) {
        var now = new Date();
        now.setDate(now.getDate() - i);
        dayArr.push(
          this.addZero(now.getMonth() + 1) +
            "月" +
            this.addZero(now.getDate()) +
            "日"
        );
        let newObj = {};
        newObj.time =
          now.getFullYear() +
          "-" +
          this.addZero(now.getMonth() + 1) +
          "-" +
          this.addZero(now.getDate());
        newObj.money = 0;
        this.seriesDayMoney.push(newObj);
      }
      return dayArr;
    },
    //得出15天的营业额
    saleMoneyData() {
      this.currentOrderData.forEach(orderItem => {
        this.seriesDayMoney.forEach(dataItem => {
          if (dataItem.time == orderItem.buyTime.substring(0, 10)) {
            orderItem.foodList.forEach(foodItem => {
              dataItem.money += foodItem.foodCount * foodItem.foodData.newMoney;
            });
          }
        });
      });
      //从数据数组中抽离出销量
      let newArr = [];
      this.seriesDayMoney.forEach(item => {
        newArr.push(item.money);
      });
      return newArr;
    },

    //饼图数据******************************************************
    foodTypeArr() {
      let newArr = [];
      this.foodList.forEach(item => {
        if (newArr.indexOf(item.foodType) == -1) {
          //尚未添加的分类
          newArr.push(item.foodType);
          let newObj = {};
          newObj.typeName = item.foodType;
          newObj.saleTimes = 0; //初始化已售出为0
          this.foodTypeData.push(newObj);
        }
      });
      return newArr;
    },
    //得出分类销售量
    saleTypeData() {
      this.currentOrderData.forEach(orderItem => {
        this.foodTypeData.forEach(dataItem => {
          orderItem.foodList.forEach(foodItem => {
            if (dataItem.typeName == foodItem.foodData.foodType) {
              dataItem.saleTimes += foodItem.foodCount;
            }
          });
        });
      });
      //从数据数组中抽离出销量
      let newArr = [];
      this.foodTypeData.forEach(item => {
        let newObj = {};
        newObj.name = item.typeName;
        newObj.value = item.saleTimes;
        newArr.push(newObj);
      });
      return newArr;
    }
  },
  methods: {
    //补零函数
    addZero(time) {
      return time < 10 ? "0" + time : time;
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