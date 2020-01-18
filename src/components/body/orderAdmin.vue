<template>
  <div class="orderAdmin">
    <!-- 当前是否有新订单：{{hasNewOrder}} -->
    <el-table :data="tableData" border style="width: 100%;margin-top:2rem" stripe>
      <el-table-column align="center" prop="addressData.tel" label="联系方式" width="180"></el-table-column>
      <el-table-column align="center" prop="addressData.name" label="收货人" width="180"></el-table-column>
      <el-table-column align="center" prop="addressData.address" label="收货地址" width="180"></el-table-column>
      <el-table-column align="center" prop="buyTime" label="下单时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template class="operation" slot-scope="scope">
          <el-button
            class="operationButton"
            v-if="scope.row.state == 'askCancel'"
            type="danger"
            size="mini"
            @click="askCancel(scope.$index, scope.row)"
          >申请取消</el-button>
          <el-button
            class="operationButton"
            plain
            disabled
            v-if="scope.row.state == 'cancelSuccess'"
            type="danger"
            size="mini"
          >已取消</el-button>
          <el-button class="checkButton" size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="orderDetailPart" v-if="isShowOrderDetails" @click.self="closeDetail">
      <orderDetail :orderDataItem="orderDataItem"></orderDetail>
    </div>

    <el-badge :value="this.newLength-this.oldLength" class="item" v-if="isShowNewOrderTip">
      <el-button type="success" class="newOrderTip" @click="openNewOrderDiv">您有新的订单等待查看</el-button>
    </el-badge>

    <div class="newOrderDiv" v-if="isShowNewOrderDiv" @click.self="closeNewOrderDiv">
      <div class="text">新订单数据列表</div>
      <el-table :data="newOrderData" border style="width: 78%" class="newOrderTable" stripe>
        <el-table-column align="center" prop="addressData.tel" label="联系方式" width="180"></el-table-column>
        <el-table-column align="center" prop="addressData.name" label="收货人" width="180"></el-table-column>
        <el-table-column align="center" prop="addressData.address" label="收货地址" width="180"></el-table-column>
        <el-table-column align="center" prop="buyTime" label="下单时间" width="180"></el-table-column>
        <el-table-column type="expand" label="菜品信息" width="183">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand">
              <el-form-item style="font-weight:bold;">
                <div class="foodItem" v-for="(item,index) in  props.row.foodList" :key="index">
                  <span class="name">{{item.foodData.foodName }}</span>
                  <span class="icon">x</span>
                  <span class="count">{{item.foodCount }}</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
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
import { getShopOrder, updateOrderState } from "../../API/getOrder";
import orderDetail from "../orderAdmin/orderDetail";
import { updateShopSaleTimes } from "../../API/updateShopSaleTimes";

export default {
  data() {
    return {
      currentPage: 1, //当前显示的页数
      pageSize: 8, //一页显示的数量
      isShowOrderDetails: false, //是否显示订单详情板块
      orderDataItem: {}, //点击传给订单详情的订单项数据
      // oldLength: 0, //上一次的长度，将新长度减去旧长度，得到的即为新长度的 订单项
      // newLength: 0, //新订单长度
      // isShowNewOrderTip: false, //是否显示新订单提示框
      isShowNewOrderDiv: false //是否显示新订单框
      // newOrderData: [] //存放新订单的数组
    };
  },
  computed: {
    ...mapGetters([
      "currentShop",
      "hasNewOrder",
      "currentOrderData",
      "oldLength",
      "newOrderData",
      "hasCancelOrder",
      "currentShopBaseData"
    ]),
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
    },
    newLength: {
      get() {
        return this.currentOrderData.length;
      },
      set() {}
    },
    isShowNewOrderTip: {
      get() {
        return this.newLength - this.oldLength > 0 ? true : false;
      },
      set() {}
    }
  },
  methods: {
    ...mapMutations({
      set_hasNewOrder: "set_hasNewOrder",
      set_currentOrderData: "set_currentOrderData",
      set_oldLength: "set_oldLength",
      set_newOrderData: "set_newOrderData",
      set_hasCancelOrder: "set_hasCancelOrder",
      set_currentShopBaseData: "set_currentShopBaseData"
    }),
    //请求数据库获取最新订单数据
    async _getShopOrder() {
      let orderData = await getShopOrder(this.currentShop.shopID);
      //更新vuex数据
      this.set_currentOrderData(orderData.reverse());
      //更新显示新的订单样式
      // this.setNewOrder(orderData.length);
    },
    //更新订单的状态
    async _updateOrderState(orderItem, state) {
      await updateOrderState(orderItem, state);
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
    //申请取消订单
    askCancel(index, row) {
      this.$confirm("是否同意取消该订单?", "提示", {
        confirmButtonText: "确定取消",
        cancelButtonText: "拒绝取消",
        type: "warning"
      })
        .then(() => {
          //在vuex 和 数据库 中 将该订单state设为cancelSuccess
          this.currentOrderData.forEach(orderItem => {
            if (orderItem.orderID == row.orderID) {
              orderItem.state = "cancelSuccess";
            }
          });
          this.set_currentOrderData(this.currentOrderData);

          this._updateOrderState(row, "cancelSuccess");

          //店铺售出量 - 1
          this.currentShopBaseData.saleTimes -= 1;
          this.set_currentShopBaseData(this.currentShopBaseData);
 
          updateShopSaleTimes(
            this.currentShopBaseData.shopID,
            this.currentShopBaseData
          );

          this.$message({
            type: "success",
            message: "已取消该订单"
          });
        })
        .catch(() => {
          //在vuex 和 数据库 中 将该订单state设为cancelFail
          this.currentOrderData.forEach(orderItem => {
            if (orderItem.orderID == row.orderID) {
              orderItem.state = "cancelFail";
            }
          });
          this.set_currentOrderData(this.currentOrderData);

          this._updateOrderState(row, "cancelFail");

          this.$message({
            type: "info",
            message: "已拒绝取消该订单"
          });
        });
    },
    //打开查看新订单数据
    openNewOrderDiv() {
      this.isShowNewOrderTip = false; //点击后关闭新订单提示
      this.newLength = 0;
      this.isShowNewOrderDiv = true;
      this.set_hasNewOrder(false); //查看后后将是否有新订单值置为false
    },
    //关闭新订单板块
    closeNewOrderDiv() {
      this.isShowNewOrderDiv = false;
      // this.newOrderData = []; //将新订单数据置为空
      this.set_oldLength(this.newLength);
      this.set_newOrderData([]);
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
          this.isShowNewOrderTip = true;
        }, 3000);
      }
    },
    hasCancelOrder(newVal) {
      if (newVal) {
        console.log("有取消订单请求，重新请求数据库");
        this._getShopOrder();
        this.$message({
          message: "有新的取消订单申请",
          type: "info"
        });
        setTimeout(() => {
          this.set_hasCancelOrder(false); //请求后将值置为false
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
  .operationButton {
    float: right;
  }
  .checkButton {
    position: absolute;
    right: 8rem;
    bottom: 0.8rem;
  }
  .orderDetailPart {
    position: fixed;
    top: 8vh;
    width: 85vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
  }
  .item {
    position: fixed;
    bottom: 1.8rem;
    right: 2rem;
    margin-top: 10px;
    margin-right: 40px;
  }
  .newOrderTip {
  }
  .newOrderDiv {
    /deep/ .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap: wrap; //flex布局下可换行
    }
    .text {
      padding: 2rem 0;
    }
    position: fixed;
    top: 8vh;
    width: 85vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
    color: white;
    // 折叠菜品部分
    /deep/ .demo-table-expand {
      border-radius: 15px;
      background-color: rgba(0, 0, 0, 0.2);
    }
    /deep/.el-table::before {
      width: 0;
      height: 0;
    }
    .newOrderTable {
      height: 60vh;
      overflow: auto;
      display: block;
      margin: 0 auto;
      /deep/ .el-form-item__content {
        padding: 1rem;
      }
      /deep/ .el-form-item__label {
        display: block;
        text-align: left;
      }
      .foodItem {
        width: 14vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name {
        }
        .icon {
          display: inline-block;
          padding-left: 0.5rem;
          font-size: 0.8rem;
          font-weight: normal;
          color: gray;
        }
        .count {
          display: inline-block;
          padding-left: 1rem;
        }
      }
    }
  }
  .pageClass {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    /deep/ .el-pager {
      li.active {
        font-size: 1.5rem !important;
      }
    }
  }
}
</style>