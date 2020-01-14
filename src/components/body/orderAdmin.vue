<template>
  <div class="orderAdmin">
    订单管理板块
    当前是否有新订单：{{hasNewOrder}}
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="addressData.tel" label="联系方式" width="180"></el-table-column>
      <el-table-column align="center" prop="addressData.name" label="收货人" width="180"></el-table-column>
      <el-table-column align="center" prop="addressData.address" label="收货地址" width="180"></el-table-column>
      <el-table-column align="center" prop="buyTime" label="下单时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="orderDetailPart" v-if="isShowOrderDetails" @click.self="closeDetail">
      <orderDetail :orderDataItem="orderDataItem"></orderDetail>
    </div>

    <el-pagination
      class="pageClass"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="allOrderSum"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getShopOrder } from "../../API/getOrder";
import orderDetail from "../orderAdmin/orderDetail";

export default {
  data() {
    return {
      currentPage: 1, //当前显示的页数
      pageSize: 3, //一页显示的数量
      isShowOrderDetails: false, //是否显示订单详情板块
      orderDataItem: {}, //点击传给订单详情的订单项数据
      oldLength: 0 //上一次的长度，将新长度减去旧长度，得到的即为新长度的 订单项
    };
  },
  computed: {
    ...mapGetters(["currentShop", "hasNewOrder", "currentOrderData"]),
    tableData() {
      let allOrder = JSON.parse(JSON.stringify(this.currentOrderData));
      let cuurrentPageOrder = allOrder.splice(
        (this.currentPage - 1) * this.pageSize, //起始条目
        this.pageSize //每页条数
      );
      //返回当前页数应当渲染的数据条数
      return cuurrentPageOrder;
    },
    allOrderSum() {
      return this.currentOrderData.length; //数据的总条数
    }
  },
  mounted() {
    this.oldLength = this.currentOrderData.length;
  },
  methods: {
    ...mapMutations({
      set_hasNewOrder: "set_hasNewOrder",
      set_currentOrderData: "set_currentOrderData"
    }),
    //请求数据库获取最新订单数据
    async _getShopOrder() {
      let orderData = await getShopOrder(this.currentShop.shopID);
      this.set_currentOrderData(orderData.reverse());
    },
    //分页操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //查看订单详情
    handleEdit(index, row) {
      this.orderDataItem = row;
      this.openDetail();
    },
    openDetail() {
      this.isShowOrderDetails = true;
    },
    closeDetail() {
      this.isShowOrderDetails = false;
    }
  },
  watch: {
    hasNewOrder(newVal) {
      if (newVal) {
        console.log("有新订单，重新请求数据库");
        this._getShopOrder();
        setTimeout(() => {
          this.set_hasNewOrder(false); //请求后将值置为false
        }, 3000);
      }
    }
  },
  components: {
    orderDetail
  }
};
</script>

<style lang="less" scoped>
.orderAdmin {
  .orderDetailPart {
    position: fixed;
    top: 8vh;
    width: 85vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
  }
  .pageClass {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>