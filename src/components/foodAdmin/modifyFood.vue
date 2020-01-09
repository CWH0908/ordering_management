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
        <van-field v-model="currentFoodName" label="菜品名称" placeholder="请输入菜品名称" required />
        <van-field v-model="currentFoodInfo" label="原料配方" placeholder="请输入菜品主料" required />
        <van-field v-model="currentNewMoney" label="最新价格" placeholder="请输入菜品价格" required />
        <van-collapse v-model="activeNames">
          <van-collapse-item title="菜品类型" name="1" :value="currentfoodType">
            <van-radio-group v-model="currentfoodTypeIndex">
              <van-radio v-for="(item,index) in foodTypeArr" :key="index" :name="index">{{item}}</van-radio>
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
      dialogImageUrl: "",
      dialogVisible: false,
      activeNames: ["0"],
      currentFoodName: "", //保存修改后的菜品名称
      currentFoodInfo: "", //保存修改后的菜品信息
      currentNewMoney: "", //保存修改后的菜品价格
      currentfoodTypeIndex: 0, //保存修改后的菜品分类的Index
      //   currentfoodType:"",//保存修改后的菜品分类的值
      currentChecked: false //保存修改后的是否推荐
    };
  },
  mounted() {
    if (JSON.stringify(this.currentFoodItem) != "{}") {
      //不是空对象，可进行赋值操作
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
        // this.currentFoodItem.pic_url=  暂未实现
        this.currentFoodItem.foodName = this.currentFoodName;
        this.currentFoodItem.foodInfo = this.currentFoodInfo;
        this.currentFoodItem.newMoney = this.currentNewMoney;
        this.currentFoodItem.isRecommend = this.currentChecked ? "yes" : "no";
        this.currentFoodItem.foodType = this.currentfoodType;

        //传递给父组件在vuex和数据库中更新
        this.$emit("saveButton", this.currentFoodItem);
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
        newObj.shopID = this.currentShop.shopID;
        newObj.foodID = `${this.currentShop.shopID}_${waterNumber}`;
        newObj.pic_url =
          "http://49.235.92.173:70/graduationDesign_images/defaultMallPic.jpeg";
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
    }
  }
};
</script>

<style lang="less" scoped>
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
        width: 50%;
        text-align: left;
        /deep/ .van-radio__icon {
          display: inline-block;
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
</style>