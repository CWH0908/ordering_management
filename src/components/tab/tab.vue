<template>
  <div class="tab">
    <el-row class="tac">
      <el-col :span="12">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="goBody('foodAdmin')">
            <i class="el-icon-fork-spoon"></i>
            <span slot="title">菜品管理</span>
          </el-menu-item>
          <el-menu-item index="2" @click="goBody('orderAdmin')">
            <i class="el-icon-tickets"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="3" @click="goBody('typeAdmin')">
            <i class="el-icon-star-off"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goBody('shopInfoAdmin')">
            <i class="el-icon-tickets"></i>
            <span slot="title">店铺管理</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goBody('dataStatistics')">
            <i class="el-icon-s-data"></i>
            <span slot="title">数据统计</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    //改变舞台组件
    goBody(type) {
      //每次切换功能导航，将body元素置为可滚动
      document.getElementsByTagName("body")[0].style.overflow = "auto";

      this.$router.push({
        path: `/main/home/${type}`
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.tab {
  width: 15vw;
  /deep/ .el-col-12 {
    width: 100%;
  }
  .el-submenu__title {
    text-align: left;
  }
}
</style>