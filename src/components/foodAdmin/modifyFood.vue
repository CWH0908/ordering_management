<template>
  <div class="modifyFood">
    <div class="container">
      <!-- <div class="uploadPart">
        <el-upload
          class="avatar-uploader"
          :action="domain"
          :http-request="upQiniu"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="imageUrl" v-lazy="imageUrl" class="avatar" />
          <div v-else>
            <i v-if="isNewEdit" class="el-icon-plus avatar-uploader-icon"></i>
            <img v-else v-lazy="firstPicUrl" class="avatar" />
          </div>
        </el-upload>
      </div>-->
      <upload
        :isNewEdit="isNewEdit"
        :firstPicUrl="firstPicUrl"
        @set_currentPicUrl="set_currentPicUrl"
      ></upload>

      <div class="inputPart">
        <van-field v-model="currentFoodName" label="菜品名称" placeholder="请输入菜品名称" required />
        <van-field v-model="currentFoodInfo" label="原料配方" placeholder="请输入菜品主料" required />
        <!-- <van-field v-model="currentNewMoney" label="最新价格" placeholder="请输入菜品价格" required /> -->
        <div class="newMoney">
          <span>最新价格</span>
          <el-input-number
            v-model="currentNewMoney"
            :precision="2"
            :step="0.5"
            :min="0"
            controls-position="right"
            size="mini"
          ></el-input-number>
        </div>
        <van-collapse v-model="activeNames">
          <van-collapse-item title="菜品类型" name="1" :value="currentfoodType">
            <van-radio-group v-model="currentfoodTypeIndex">
              <van-radio v-for="(item,index) in foodTypeArr" :key="index" :name="index">{{item}}</van-radio>
              <van-radio :name="foodTypeArr.length">
                <el-input class="newInput" placeholder="请输入新分类" v-model="newType"></el-input>
              </van-radio>
            </van-radio-group>
          </van-collapse-item>
        </van-collapse>
        <div class="isRecommend">
          是否推荐
          <van-switch v-model="currentChecked" />
        </div>
      </div>

      <div class="operationPart">
        <van-button v-if="!isNewEdit" type="info" @click="saveButton">保存</van-button>
        <van-button v-if="isNewEdit" type="info" @click="insertButton">新增</van-button>
        <van-button type="warning" @click="cancelButton">取消</van-button>
        <van-button v-if="!isNewEdit" type="danger" @click="deleteButton">删除</van-button>
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
import {RemoteUrl} from "../../API/RemoteServer"

export default {
  props: {
    currentFoodItem: {
      type: Object,
      default: () => {}
    },
    foodTypeArr: {
      type: Array,
      default: () => []
    },
    isNewEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: ["0"],
      firstPicUrl: "", //修改菜品之前的旧图片
      currentPicUrl: "", //保存修改后的菜品图片
      currentFoodName: "", //保存修改后的菜品名称
      currentFoodInfo: "", //保存修改后的菜品信息
      currentNewMoney: "", //保存修改后的菜品价格
      currentfoodTypeIndex: 0, //保存修改后的菜品分类的Index
      //   currentfoodType:"",//保存修改后的菜品分类的值
      currentChecked: false, //保存修改后的是否推荐
      newType: "新分类", //新的分类

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
    if (JSON.stringify(this.currentFoodItem) != "{}") {
      //不是空对象，可进行赋值操作
      this.currentPicUrl = this.currentFoodItem.pic_url;
      this.firstPicUrl = "http://" + qiniuDomain + "/" + this.currentPicUrl;
      this.currentFoodName = this.currentFoodItem.foodName;
      this.currentFoodInfo = this.currentFoodItem.foodInfo;
      this.currentNewMoney = this.currentFoodItem.newMoney;
      this.currentChecked = this.isChecked;
      this.currentfoodTypeIndex = this.foodTypeIndex;
    }
  },
  computed: {
    ...mapGetters(["currentShop"]),
    foodTypeIndex() {
      let foodType = this.currentFoodItem.foodType;
      //   this.currentfoodType = this.foodTypeArr.indexOf(foodType);
      return this.foodTypeArr.indexOf(foodType);
    },
    isChecked() {
      let isChecked = this.currentFoodItem.isRecommend;
      let bool = isChecked == "yes" ? true : false;
      return bool;
    },
    // 保存修改后的菜品分类的值
    currentfoodType() {
      if (this.currentfoodTypeIndex >= this.foodTypeArr.length) {
        return this.newType;
      }
      for (let i = 0; i < this.foodTypeArr.length; i++) {
        if (this.currentfoodTypeIndex == i) {
          return this.foodTypeArr[i];
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
        this.currentFoodName != "" &&
        this.currentFoodInfo != "" &&
        this.currentNewMoney != "" &&
        this.currentfoodType != ""
      ) {
        //未上传图片,原图片地址不变
        if (this.currentPicUrl != "") {
          this.currentFoodItem.pic_url = this.currentPicUrl;
        }
        //选择新分类但是值为空
        if (this.currentfoodType == "") {
          Toast("请完善分类信息");
        } else {
          this.currentFoodItem.foodName = this.currentFoodName;
          this.currentFoodItem.foodInfo = this.currentFoodInfo;

          this.currentFoodItem.newMoney = this.currentNewMoney;
          this.currentFoodItem.isRecommend = this.currentChecked ? "yes" : "no";
          this.currentFoodItem.foodType = this.currentfoodType;

          //传递给父组件在vuex和数据库中更新
          this.$emit("saveButton", this.currentFoodItem);
        }
      } else {
        Toast("请完善录入信息");
      }
    },
    //新增按钮
    insertButton() {
      if (
        this.currentFoodName != "" &&
        this.currentFoodInfo != "" &&
        this.currentNewMoney != "" &&
        this.currentfoodType != ""
      ) {
        let newObj = {};
        let time = new Date();
        let waterNumber = time.getTime();
        // 未选择图片，使用默认图片
        if (this.currentPicUrl == "") {
          newObj.pic_url = "defaultMall.jpeg";
        } else {
          newObj.pic_url = this.currentPicUrl;
        }
        //选择新分类但是值为空
        if (this.currentfoodType == "") {
          Toast("请完善分类信息");
        } else {
          newObj.shopID = this.currentShop.shopID;
          newObj.foodID = `${this.currentShop.shopID}_${waterNumber}`;
          newObj.foodName = this.currentFoodName;
          newObj.foodSaleTimes = 0;
          newObj.foodInfo = this.currentFoodInfo;
          newObj.oldMoney = 0;
          newObj.newMoney = this.currentNewMoney;
          newObj.isRecommend = this.currentChecked ? "yes" : "no";
          newObj.saleTimes = 0;
          newObj.foodType = this.currentfoodType;

          //传递给父组件在vuex和数据库中更新
          this.$emit("insertButton", newObj);
        }
      } else {
        Toast("请完善录入信息");
      }
    },
    //取消按钮
    cancelButton() {
      this.$emit("cancelButton");
    },
    //删除按钮
    deleteButton() {
      this.$confirm("此操作将永久删除该菜品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("deleteButton", this.currentFoodItem.foodID);
        })
        .catch(() => {});
    },

    //七牛云上传操作**********************************************************************************
    //接收子组件抛出修改当前图片地址的函数
    set_currentPicUrl(currentPicUrl) {
      this.currentPicUrl = currentPicUrl;
    },
    upQiniu(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";
      if (req.file.type === "image/png") {
        filetype = "png";
      } else {
        filetype = "jpg";
      }
      //取得图片名
      let uploadImgName = req.file.name.substring(
        0,
        req.file.name.indexOf(".")
      );
      // 重命名要上传的文件
      const keyname =
        "cwh-imglist_" +
        uploadImgName +
        "_" +
        new Date().getTime() +
        "." +
        filetype;

      this.currentPicUrl = keyname;

      // 从后端获取上传凭证token,此处在前端配置proxyTable代理进行跨域
      // axios.get("/upload/token").then(res => {
      axios.get("http://49.235.92.173:8082/upload/remote/token").then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data);
        formdata.append("key", keyname);
        // 获取到凭证之后再将文件上传到七牛云空间
        axios.post(this.domain, formdata, config).then(res => {
          this.imageUrl = "http://" + this.qiniuaddr + "/" + res.data.key;
        });
      });
    },
    // 验证文件合法性
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  components: {
    upload
  }
};
</script>

<style lang="less" scoped>
//隐藏滚动条
.container::-webkit-scrollbar {
  display: none;
}
.modifyFood {
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
    height: 35rem;
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
      //费用，包含计数器
      .newMoney {
        text-align: left;
        padding-left: 2.1rem;
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 4rem;
          font-size: 0.8rem;
          text-align: left;
        }
        // 计数器按钮
        /deep/ .el-input-number--mini {
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