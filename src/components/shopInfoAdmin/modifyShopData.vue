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
        <!-- 起送价 -->
        <div class="FeePart">
          <span>起送价</span>
          <el-input-number
            v-model="currentStratFee"
            :precision="2"
            :step="0.5"
            :min="0"
            controls-position="right"
            size="mini"
          ></el-input-number>
        </div>
        <!-- 配送价 -->
        <div class="FeePart">
          <span>配送费</span>
          <el-input-number
            v-model="currentSendFee"
            :precision="2"
            :step="0.5"
            :min="0"
            controls-position="right"
            size="mini"
          ></el-input-number>
        </div>

        <van-field v-model="currentPhone" label="商家电话" placeholder="请输入联系电话" required />
        <div class="isClose">
          <span>临时关门</span>
          <van-switch v-model="currentIsClose" />
        </div>

        <div class="Time">
          <span>营业时间</span>
          <el-time-picker
            is-range
            clearable
            v-model="timeValue"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </div>
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
      currentStratFee: 0,
      currentSendFee: 0,
      currentPhone: "",
      currentOpenTime: "",
      currentCloseTime: "",
      currentIsClose: false,

      timeValue: [new Date(0, 0, 0, 8, 0), new Date(0, 0, 0, 20, 0)],

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
    this.timeValue = this.formatTime(
      this.currentOpenTime,
      this.currentCloseTime
    );
    this.currentIsClose = this.currentShopBaseData.isClose;
  },
  computed: {
    ...mapGetters(["currentShop"]),
    mallTypeIndex() {
      let mallType = this.currentShopBaseData.mallType;
      return this.mallTypeArr.indexOf(mallType);
    },
    currentMallType: {
      get() {
        for (let i = 0; i < this.mallTypeArr.length; i++) {
          if (this.currentMallTypeIndex == i) {
            return this.mallTypeArr[i];
          }
        }
      },
      set() {}
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
        // this.currentStratFee != "" &&
        // this.currentSendFee != "" &&
        this.currentPhone != "" &&
        this.currentOpenTime != "" &&
        this.currentCloseTime != "" &&
        this.timeValue != null
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
        this.currentShopBaseData.isClose = this.currentIsClose;

        //传递给父组件在vuex和数据库中更新
        this.$emit("saveButton", this.currentShopBaseData);
      } else {
        Toast("请完善录入信息");
      }
    },
    //取消按钮
    cancelButton() {
      this.$emit("cancelButton");
    },
    //格式化时间
    formatTime(openTime, closeTime) {
      //根据开门和关门时间，格式化出时间类型数据初始化时间选择器
      let openHour = Number(openTime.split(":")[0]);
      let openMinute = Number(openTime.split(":")[1]);
      let closeHour = Number(closeTime.split(":")[0]);
      let closeMinute = Number(closeTime.split(":")[1]);
      return [
        new Date(0, 0, 0, openHour, openMinute),
        new Date(0, 0, 0, closeHour, closeMinute)
      ];
    },
    //补0操作
    addZero(value) {
      if (value < 10) {
        return "0" + value;
      } else {
        return value;
      }
    },

    //七牛云上传操作**********************************************************************************
    //接收子组件抛出修改当前图片地址的函数
    set_currentPicUrl(currentPicUrl) {
      console.log("接收到新的图片地址，", currentPicUrl);
      this.currentPicUrl = currentPicUrl;
    }
  },
  watch: {
    timeValue(newVal) {
      let openHour = this.addZero(newVal[0].getHours());
      let openMinute = this.addZero(newVal[0].getMinutes());
      this.currentOpenTime = openHour + ":" + openMinute;

      let closeHour = this.addZero(newVal[1].getHours());
      let closeMinute = this.addZero(newVal[1].getMinutes());
      this.currentCloseTime = closeHour + ":" + closeMinute;

      // console.log("设置新的时间", this.currentOpenTime, this.currentCloseTime);
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
//隐藏滚动条
.container::-webkit-scrollbar {
  display: none;
}
.modifyShopData {
  width: 100%;
  .container {
    overflow: auto;
    position: absolute;
    top: -3rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 30vw;
    height: 90vh;
    background-color: white;
    border-radius: 8px;
    .uploadPart {
      width: 100%;
      overflow: hidden;
      margin: 1rem 0;
    }
    .inputPart {
      // 单选按钮
      /deep/ .van-radio-group {
        padding-left: 1rem;
        text-align: left;
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
      //下拉框
      /deep/ .van-cell__right-icon {
        margin: 0 9px;
      }
      // 输入框
      /deep/ .van-cell--required {
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      /deep/ .van-cell {
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 14px;
        padding-right: 0px;
      }
      /deep/ .van-cell__title {
        text-align: left;
        text-indent: 1.1rem;
      }
      /deep/ .el-input {
        font-size: 12px;
        width: 75%;
      }
      /deep/ .van-field__control {
        padding-right: 2rem;
        text-align: right;
      }
      // 计数器按钮
      /deep/ .el-input-number--mini {
        float: right;
        height: 32px;
        line-height: 32px;
        /deep/ .el-input-number__increase {
          border-radius: 8px;
          background: #409eff;
          color: white;
        }
        /deep/ .el-input-number__decrease {
          border-radius: 8px;
          background: #f56c6c;
          color: white;
        }
      }
      /deep/.el-input__inner {
        height: 25px;
        line-height: 25px;
      }
      //费用，包含计数器
      .FeePart {
        text-align: left;
        padding-left: 2.1rem;
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 38%;
          font-size: 0.9rem;
          text-align: left;
        }
      }
      // 时间，包含时间选择器
      .Time {
        text-align: left;
        padding-left: 2.1rem;
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 38%;
          font-size: 0.9rem;
          text-align: left;
        }
        /deep/ .el-input__inner {
          height: 38px;
          line-height: 38px;
        }
      }
      //临时关门，包含开关
      .isClose {
        text-align: left;
        padding-left: 2.1rem;
        font-size: 0.9rem;
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 75%;
          font-size: 0.9rem;
          text-align: left;
        }
        /deep/ .van-switch {
          font-size: 20px;
          margin-left: 1rem;
          vertical-align: middle;
        }
      }
    }
    .operationPart {
      /deep/ .van-button {
        margin-top: 0.5rem;
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
  width: 150px;
  height: 150px;
  display: block;
}
</style>