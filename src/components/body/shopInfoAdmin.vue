<template>
  <div class="shopInfoAdmin">
    <div class="container">
      <!-- 头部信息 -->
      <header :style="bgStyle">
        <img :src="getPicUrl(currentShopBaseData.pic_url)" alt />
        <div class="rightPart">
          <p>店铺ID:{{currentShopBaseData.shopID}}</p>
          <p>
            <span style="font-weight:normal">评分:</span>
            <el-rate style="display:inline-block;" v-model="currentShopBaseData.rateValue" disabled></el-rate>
          </p>临时关门
          <el-switch
            v-model="currentShopBaseData.isClose"
            active-color="#409EFF"
            inactive-color="#606266"
          ></el-switch>
        </div>
      </header>
      <!-- 基本信息 -->
      <div class="dataPart">
        <ul>
          <li>
            <div class="dataItem">
              <span class="left">商家名称</span>
              <span class="right">{{currentShopBaseData.shopName}}</span>
            </div>
          </li>
          <li>
            <div class="dataItem">
              <span class="left">商家品类</span>
              <span class="right">{{currentShopBaseData.mallType|formatMallType}}</span>
            </div>
          </li>
          <li>
            <div class="dataItem">
              <span class="left">起送价</span>
              <span class="right">￥{{currentShopBaseData.startFee}}</span>
            </div>
          </li>
          <li>
            <div class="dataItem">
              <span class="left">配送费</span>
              <span class="right">￥{{currentShopBaseData.sendFee}}</span>
            </div>
          </li>
          <li>
            <div class="dataItem">
              <span class="left">商家电话</span>
              <span class="right">{{currentShopBaseData.phone}}</span>
            </div>
          </li>
          <li>
            <div class="dataItem">
              <span class="left">营业时间</span>
              <span
                class="right"
              >{{currentShopBaseData.openTime}} — — {{currentShopBaseData.closeTime}}</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 操作按钮 -->
      <el-button type="danger" @click="openEdit">修改资料</el-button>
    </div>
    <!-- 编辑框 -->
    <div v-if="isShowShopDataEdit" class="modifyPart" @click.self="closeEdit">
      <modifyShopData
        :currentShopBaseData="currentShopBaseData"
        @cancelButton="closeEdit"
        :mallTypeArr="mallTypeArr"
      ></modifyShopData>
    </div>
  </div>
</template>

<script>
import upload from "../base/upload";
import { mapMutations, mapGetters } from "vuex";
import { getHomeShoplist } from "../../API/getHomeShopList";
import modifyShopData from "../shopInfoAdmin/modifyShopData";
import { qiniuDomain } from "../../API/qiniuDomain";

export default {
  data() {
    return {
      currentShopBaseData: {}, //存留当前店铺的基本信息
      isClose: false, //当前是否关门
      isShowShopDataEdit: false //是否显示编辑框
    };
  },
  created() {
    this._getHomeShoplist();
  },
  methods: {
    //返回拼接外链后的图片地址
    getPicUrl(pic_url) {
      return "http://" + qiniuDomain + "/" + pic_url;
    },
    //获取店铺基本信息
    async _getHomeShoplist() {
      this.currentShopBaseData = await getHomeShoplist(this.shopID);
    },
    //点击修改资料，打开编辑框
    openEdit() {
      this.isShowShopDataEdit = true;
    },
    //关闭编辑框
    closeEdit() {
      this.isShowShopDataEdit = false;
    }
  },
  computed: {
    ...mapGetters(["currentShop", "mallTypeArr"]),
    bgStyle() {
      //用高斯模糊头像做背景图
      // return `background-image:url(${this.currentShopBaseData.pic_url});background-size:cover;filter: blur(20px);`;
    },
    shopID() {
      return this.currentShop.shopID;
    }
  },
  filters: {
    formatMallType(mallType) {
      switch (mallType) {
        case "Noodles":
          return "粥粉面饭";
          break;
        case "Popular":
          return "热门畅销";
          break;
        case "Fruit":
          return "水果甜品";
          break;
        case "Drinks":
          return "奶茶饮料";
          break;
        case "Barbecue":
          return "爆香烧烤";
          break;
        case "Hamburger":
          return "汉堡披萨";
          break;
        default:
          return "暂未定义";
          break;
      }
    }
  },
  components: {
    modifyShopData
  }
};
</script>

<style lang="less" scoped>
.shopInfoAdmin {
  .container {
    text-align: left;
    header {
      padding: 2rem 3rem;
      font-size: 1.2rem;
      line-height: 2;
      background: -webkit-gradient(
        linear,
        0 0,
        0 100%,
        from(rgb(140, 197, 255)),
        to(#b0c4de)
      );
      img {
        width: 12vw;
        height: 12vw;
        border-radius: 8px;
      }
      .rightPart {
        display: inline-block;
        padding-left: 2rem;
        /deep/ .el-rate__icon {
          color: red !important;
        }
        p {
          font-weight: 900;
        }
      }
    }
    .dataPart {
      width: 50%;
      padding: 2rem 3rem;
      ul {
        li {
          height: 8vh;
          line-height: 8vh;
          padding: 0 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          .dataItem {
            .left {
              float: left;
              text-align: left;
            }
            .right {
              float: right;
              text-align: right;
            }
          }
        }
      }
    }
    .el-button {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
    }
  }
  .modifyPart {
    position: fixed;
    top: 8vh;
    width: 85vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>