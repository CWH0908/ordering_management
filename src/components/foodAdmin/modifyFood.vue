<template>
  <div class="modifyFood">
    <div class="container">
      <div class="uploadPart">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </div>

      <div class="inputPart">
        <!-- <van-cell-group> -->
        <van-field v-model="currentFoodItem.foodName" label="菜品名称" placeholder="请输入菜品名称" required />
        <van-field v-model="currentFoodItem.foodInfo" label="原料配方" placeholder="请输入菜品主料" required />
        <van-field v-model="currentFoodItem.newMoney" label="最新价格" placeholder="请输入菜品价格" required />
        <van-collapse v-model="activeNames">
          <van-collapse-item title="菜品类型" name="1">
            <van-radio-group v-model="currentfoodType">
              <van-radio v-for="(item,index) in foodTypeArr" :key="index" :name="index">{{item}}</van-radio>
            </van-radio-group>
          </van-collapse-item>
        </van-collapse>
        <van-field v-model="currentFoodItem.isRecommend" label="是否推荐" placeholder="请输入密码" required />
        <!-- </van-cell-group> -->
      </div>

      <div class="operationPart">
        <van-button type="info">保存</van-button>
        <van-button type="warning">取消</van-button>
        <van-button type="danger">删除</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentFoodItem: {
      type: Object,
      default: () => {}
    },
    foodTypeArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      activeNames: ["0"]
    };
  },
  computed: {
    currentfoodType() {
      let foodType = this.currentFoodItem.foodType;
      return this.foodTypeArr.indexOf(foodType);
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.modifyFood {
  width: 100%;
  .container {
    // overflow: auto;
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
    }
    .operationPart {
      /deep/ .van-button {
        margin-top: 1rem;
        width: 85%;
      }
    }
  }
}
</style>