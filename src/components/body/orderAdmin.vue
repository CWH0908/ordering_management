<template>
  <div class="orderAdmin">
    订单管理板块
    当前是否有新订单：{{hasNewOrder}}
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentShop", "hasNewOrder"])
  },
  methods: {
    ...mapMutations({
      set_hasNewOrder: "set_hasNewOrder"
    })
  },
  watch: {
    hasNewOrder(newVal) {
      if (newVal) {
        console.log("有新订单，重新请求数据库");
        setTimeout(() => {
          this.set_hasNewOrder(false); //请求后将值置为false
        }, 3000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>