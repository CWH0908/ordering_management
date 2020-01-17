<template>
  <div class="pieEchars">
    <chart :options="pieOrgOptions" :auto-resize="true"></chart>
  </div>
</template>

<script>
export default {
  props: {
    foodTypeArr: {
      type: Array,
      default: () => []
    },
    saleTypeData:{
        type:Array,
        default:()=>[]
    }
  },
  computed: {
    pieOrgOptions() {
      return {
        title: {
          text: "菜品分类销售情况", //主标题
          subtext: "根据所售菜品的分类进行统计", //副标题
          x: "center" //x轴方向对齐方式
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: this.foodTypeArr
        },
        series: [
          {
            name: "各分类销售额",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.saleTypeData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    }
  }
};
</script>

<style>
</style>