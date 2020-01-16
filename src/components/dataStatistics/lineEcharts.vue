<template>
  <div class="lineEcharts">
    <chart :options="lineOrgOptions" :auto-resize="true"></chart>
  </div>
</template>

<script>
export default {
  computed: {
    // 折线图
    lineOrgOptions() {
      return {
        title: {
          text: "近30天订单数据", //主标题
          subtext: "根据用户的下单情况统计", //副标题
          x: "center" //x轴方向对齐方式
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        smooth: true, //折线平滑
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
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