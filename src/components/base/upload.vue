<template>
  <div class="uploadPart">
    <el-upload
      class="avatar-uploader"
      :action="domain"
      :http-request="upQiniu"
      :show-file-list="false"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <div v-else>
        <i v-if="isNewEdit" class="el-icon-plus avatar-uploader-icon"></i>
        <img v-else :src="firstPicUrl" class="avatar" />
      </div>
    </el-upload>
  </div>
</template>

<script>
import { qiniuDomain } from "../../API/qiniuDomain";
import {RemoteUrl} from "../../API/RemoteServer"
import axios from "axios";
export default {
  props: {
    isNewEdit: {
      type: Boolean,
      default: false
    },
    firstPicUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      //七牛云数据变量
      imageUrl: "", //预览的图片地址
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: "http://upload-z2.qiniup.com",
      // 这是七牛云空间的外链默认域名
      qiniuaddr: qiniuDomain
    };
  },
  methods: {
    //七牛云上传操作**********************************************************************************
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
      // const keyname = `cwh-imglist_${uploadImgName}_${new Date().getTime()}.${filetype}`;

      //   this.currentPicUrl = keyname;
      //向父组件抛出最新的图片
      this.$emit("set_currentPicUrl", keyname);

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
  }
};
</script>

<style lang="less" scoped>
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
  border: 1px dotted rgba(0, 0, 0, 0.4);
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>