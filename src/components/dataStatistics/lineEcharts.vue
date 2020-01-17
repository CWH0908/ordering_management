<template>
  <div class="lineEcharts">
    <chart :options="lineOrgOptions" :auto-resize="true"></chart>
  </div>
</template>

<script>
export default {
  props: {
    getRecentlyDay: {
      type: Array,
      default: () => []
    },
    saleMoneyData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 折线图
    lineOrgOptions() {
      return {
        title: {
          text: "近15天销量数据", //主标题
          subtext: "根据用户的下单情况统计", //副标题
          x: "center" //x轴方向对齐方式
        },
        tooltip: {
          trigger: "item",
          formatter: "销售额 <br/>{b} : {c} 元"
        },
        xAxis: {
          type: "category",
          data: this.getRecentlyDay
        },
        yAxis: {
          type: "value"
        },
        smooth: true, //折线平滑
        series: [
          {
            data: this.saleMoneyData,
            type: "line",
            smooth: true
          }
        ]
      };
    }
  }
};
</script>

<style>
</style>