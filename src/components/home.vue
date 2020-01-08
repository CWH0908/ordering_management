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
  </div>
</template>

<script>
import tab from "../components/tab/tab";
import topHeader from "../components/topHeader/topHeader";
export default {
  components: {
    tab,
    topHeader
  }
};
</script>

<style lang="less" scoped>
.home {
  .header{
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
}
</style>