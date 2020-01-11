<template>
  <div class="modifyShopData">
    <div class="container">
      <upload :firstPicUrl="firstPicUrl" @set_currentPicUrl="set_currentPicUrl"></upload>

      <div class="inputPart">
        <van-field v-model="currentShopName" label="商家名称" placeholder="请输入商家名称" required />
        <van-collapse v-model="activeNames">
          <van-collapse-item title="商家品类" name="1" :value="currentMallType|formatMallType">
            <van-radio-group v-model="currentMallTypeIndex">
              <van-radio
                v-for="(item,index) in mallTypeArr"
                :key="index"
                :name="index"
              >{{item|formatMallType}}</van-radio>
            </van-radio-group>
          </van-collapse-item>
        </van-collapse>
        <!-- <van-field v-model="currentStratFee" label="起送价" placeholder="请输入起送价" required /> -->
        起送价
        <el-input-number v-model="currentStratFee" :precision="2" :step="0.5" ></el-input-number>
        <van-field v-model="currentSendFee" label="配送费" placeholder="请输入配送费" required />
        <van-field v-model="currentPhone" label="商家电话" placeholder="请输入联系电话" required />
        <van-field v-model="currentOpenTime" label="营业时间" placeholder="请选择营业时间" required />

        <!-- <div class="isRecommend">
          是否推荐
          <van-switch v-model="currentChecked" />
        </div>-->
      </div>

      <div class="operationPart">
        <van-button type="info" @click="saveButton">保存</van-button>
        <van-button type="warning" @click="cancelButton">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapGetters } from "vuex";
import axios from "axios";
import { qiniuDomain } from "../../API/qiniuDomain"; //引入七牛外链
import upload from "../base/upload";

export default {
  props: {
    currentShopBaseData: {
      type: Object,
      default: () => {}
    },
    mallTypeArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeNames: ["0"],
      firstPicUrl: "", //修改菜品之前的旧图片
      currentPicUrl: "", //保存修改后的菜品图片
      currentShopName: "",
      currentMallTypeIndex: 0,
      //   currentMallType: "",
      currentStratFee: "",
      currentSendFee: "",
      currentPhone: "",
      currentOpenTime: "",
      currentCloseTime: "",

      //七牛云数据变量
      imageUrl: "", //预览的图片地址
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: "https://upload-z2.qiniup.com",
      // 这是七牛云空间的外链默认域名
      qiniuaddr: qiniuDomain
    };
  },
  mounted() {
    //不是空对象，可进行赋值操作
    this.currentPicUrl = this.currentShopBaseData.pic_url;
    this.firstPicUrl = "http://" + qiniuDomain + "/" + this.currentPicUrl;
    this.currentShopName = this.currentShopBaseData.shopName;
    this.currentMallType = this.currentShopBaseData.mallType;
    this.currentMallTypeIndex = this.mallTypeIndex;
    this.currentStratFee = this.currentShopBaseData.startFee;
    this.currentSendFee = this.currentShopBaseData.sendFee;
    this.currentPhone = this.currentShopBaseData.phone;
    this.currentOpenTime = this.currentShopBaseData.openTime;
    this.currentCloseTime = this.currentShopBaseData.closeTime;
  },
  computed: {
    ...mapGetters(["currentShop"]),
    mallTypeIndex() {
      let mallType = this.currentShopBaseData.mallType;
      return this.mallTypeArr.indexOf(mallType);
    },
    // isChecked() {
    //   let isChecked = this.currentFoodItem.isRecommend;
    //   let bool = isChecked == "yes" ? true : false;
    //   return bool;
    // },
    currentMallType() {
      for (let i = 0; i < this.mallTypeArr.length; i++) {
        if (this.currentMallTypeIndex == i) {
          return this.mallTypeArr[i];
        }
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //保存按钮
    saveButton() {
      if (
        this.currentShopName != "" &&
        this.currentMallType != "" &&
        this.currentStratFee != "" &&
        this.currentSendFee != "" &&
        this.currentPhone != "" &&
        this.currentOpenTime != "" &&
        this.currentCloseTime != ""
      ) {
        //未上传图片,原图片地址不变
        if (this.currentPicUrl != "") {
          this.currentShopBaseData.pic_url = this.currentPicUrl;
        }

        this.currentShopBaseData.shopName = this.currentShopName;
        this.currentShopBaseData.mallType = this.currentMallType;
        this.currentShopBaseData.startFee = this.currentStratFee;
        this.currentShopBaseData.sendFee = this.currentSendFee;
        this.currentShopBaseData.phone = this.currentPhone;
        this.currentShopBaseData.openTime = this.currentOpenTime;
        this.currentShopBaseData.closeTime = this.currentCloseTime;

        //传递给父组件在vuex和数据库中更新
        // this.$emit("saveButton", this.currentShopBaseData);
      } else {
        Toast("请完善录入信息");
      }
    },
    //取消按钮
    cancelButton() {
      this.$emit("cancelButton");
    },

    //七牛云上传操作**********************************************************************************
    //接收子组件抛出修改当前图片地址的函数
    set_currentPicUrl(currentPicUrl) {
      console.log("接收到新的图片地址，", currentPicUrl);
      this.currentPicUrl = currentPicUrl;
    }
  },
  components: {
    upload
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
  }
};
</script>

<style lang="less" scoped>
.modifyShopData {
  width: 100%;
  .container {
    overflow: auto;
    position: absolute;
    top: -2rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 24vw;
    height: 87vh;
    background-color: white;
    border-radius: 8px;
    .uploadPart {
      width: 100%;
      overflow: hidden;
      margin: 1rem 0;
    }
    .inputPart {
      /deep/ .van-radio-group {
        padding-left: 1rem;
        text-align: left;
      }
      /deep/ .van-cell--required {
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      /deep/ .van-cell {
        padding-top: 4px;
        padding-bottom: 4px;
      }
      /deep/ .van-cell__title {
        text-align: left;
        text-indent: 1.1rem;
      }
      /deep/.van-radio {
        display: inline-block;
        width: 100%;
        text-align: left;
        /deep/ .van-radio__icon {
          display: inline-block;
          vertical-align: middle;
        }
      }
      /deep/ .el-input {
        font-size: 12px;
        width: 75%;
      }
      .newType {
        display: inline-block;
        width: 40%;
      }
      /deep/.el-input__inner {
        height: 25px;
        line-height: 25px;
      }
      .isRecommend {
        text-align: left;
        padding-left: 2rem;
        font-size: 0.9rem;
        /deep/ .van-switch {
          font-size: 20px;
          margin-left: 1rem;
        }
      }
    }
    .operationPart {
      /deep/ .van-button {
        margin-top: 1rem;
        width: 85%;
      }
    }
  }
}
//七牛云样式
.upload {
  width: 600px;
  margin: 0 auto;
}
.avatar-uploader .el-upload {
  border: 5px dashed #ca1717 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>