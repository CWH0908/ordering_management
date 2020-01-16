<template>
  <div class="barEcharts">
    <chart :options="barOrgOptions" :auto-resize="true"></chart>
  </div>
</template>

<script>
// 引入echarts,用于柱状图的颜色变化
import echarts from "echarts";

export default {
  props: {
    bar_xAxis: {
      type: Array,
      default: () => []
    },
    hotSaleData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      yMax: 0,
      dataShadow: []
    };
  },
  computed: {
    dataAxis() {
      return this.bar_xAxis;
    },
    data() {
      return this.hotSaleData;
    },
    //渲染的总数据
    barOrgOptions() {
      return {
        title: {
          text: "热销菜品统计",
          subtext: "根据订单中该菜品的数量进行统计",
          x: "center" //x轴方向对齐方式
        },
        xAxis: {
          type: "category",
          data: this.dataAxis
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)"
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: this.dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            //柱状图上方显示数值
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16
                  }
                }
              }
            },

            data: this.data
          }
        ]
      };
    }
  },
  created() {
    this.yMax = 20;
    this.dataShadow = [];

    for (var i = 0; i < this.data.length; i++) {
      this.dataShadow.push(this.yMax);
    }
  }
};
</script>

<style lang="less" scoped>
</style>