<template>
  <div class="home">
    <el-header>
      <topHeader></topHeader>
    </el-header>

    <div class="aside">
      <tab></tab>
    </div>

    <div class="body">
      这里放主体舞台组件
      <router-view></router-view>
      <router-view></router-view>
      <router-view></router-view>
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
  .aside {
    width: 20vw;
    float: left;
  }
  .body {
    overflow: hidden;
    background-color: #67c23a;
  }
}
</style>