<template>
  <div class="foodAdmin">
    <div class="container">
      <div class="search">
        <el-input placeholder="搜索菜品" v-model="searchFoodItem" clearable></el-input>
      </div>

      <ul v-if="searchFoodItem==''">
        <!-- 新增栏目 -->
        <li class="addItem" @click="openModify({})">
          <div class="addIcon">
            <i class="el-icon-plus"></i>
          </div>
        </li>
        <!-- 现有菜品项 -->
        <li v-for="(item,index) in foodList" :key="index" @click="openModify(item)">
          <div>
            <img v-lazy="getPicUrl(item.pic_url)" alt />
            <div class="textPart">
              <p class="foodName">{{item.foodName}}</p>
              <p style="color:gray;">{{item.foodType}}</p>
              <p>{{item.foodInfo}}</p>
              <p>￥{{item.newMoney}}</p>
            </div>
          </div>
        </li>
      </ul>

      <div v-else>
        <!-- 搜索到的菜品项 -->
        <div style="color:gray;margin-top:5rem;" v-if="searchFoodList.length==0">搜索不到该菜品</div>
        <ul v-else>
          <li v-for="(item,index) in searchFoodList" :key="index" @click="openModify(item)">
            <div>
              <img v-lazy="getPicUrl(item.pic_url)" alt />
              <div class="textPart">
                <p class="foodName">{{item.foodName}}</p>
                <p>{{item.foodType}}</p>
                <p>{{item.foodInfo}}</p>
                <p>￥{{item.newMoney}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 编辑框 -->
      <div class="modifyFoodPart" v-if="isShowModifyPart" @click.self="changeIsShow">
        <modifyFood
          :currentFoodItem="currentFoodItem"
          :foodTypeArr="foodTypeArr"
          :isNewEdit="isNewEdit"
          @saveButton="saveButton"
          @cancelButton="changeIsShow"
          @deleteButton="deleteButton"
          @insertButton="insertButton"
        ></modifyFood>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import modifyFood from "../foodAdmin/modifyFood";
import { Toast } from "vant";
import { qiniuDomain } from "../../API/qiniuDomain"; //引入七牛外链
import {
  updateFoodList,
  deleteFoodItem,
  insertFoodItem
} from "../../API/updateFoodList";
let that = this;
export default {
  data() {
    return {
      isShowModifyPart: false, //是否显示编辑框
      currentFoodItem: {}, //当前点击的菜品信息传值到编辑框
      isNewEdit: false, //是否为新增菜品的编辑框
      searchFoodItem: "", //搜索菜品
      searchFoodList: "" //搜索得到的菜品列表
    };
  },
  created() {
    this.qiniuDomain = qiniuDomain;
  },
  methods: {
    ...mapMutations({
      set_foodList: "set_foodList"
    }),
    //返回拼接外链后的图片地址
    getPicUrl(pic_url) {
      return "http://" + qiniuDomain + "/" + pic_url;
    },
    //打开菜品修改框
    openModify(item) {
      if (JSON.stringify(item) == "{}") {
        this.isNewEdit = true;
      }
      this.currentFoodItem = item;
      this.isShowModifyPart = true;
    },
    //保存菜品修改
    saveButton(foodItem) {
      //在vuex中更新
      for (let i = 0; i < this.foodList.length; i++) {
        if (this.foodList[i].foodID == foodItem.foodID) {
          this.foodList[i] = JSON.parse(JSON.stringify(foodItem));
        }
      }
      this.set_foodList(this.foodList);

      //需在数据库中更新
      updateFoodList(foodItem.foodID, foodItem);

      Toast("修改成功");
      this.changeIsShow();
    },
    //新增菜品
    insertButton(foodItem) {
      //在vuex中新增
      this.foodList.push(foodItem);
      this.set_foodList(this.foodList);

      //在数据库中新增
      insertFoodItem(foodItem);

      Toast("添加成功");
      this.changeIsShow();
    },
    //删除菜品
    deleteButton(foodID) {
      //在vuex中删除
      for (let i = 0; i < this.foodList.length; i++) {
        if (this.foodList[i].foodID == foodID) {
          this.foodList.splice(i, 1);
        }
      }
      this.set_foodList(this.foodList);

      //在数据库中删除
      deleteFoodItem(foodID);

      Toast("删除成功");
      this.changeIsShow();
    },
    //关闭编辑框
    changeIsShow() {
      this.isNewEdit = false;
      this.isShowModifyPart = false;
    }
  },
  computed: {
    ...mapGetters(["currentShop", "foodList"]),
    shopID() {
      return this.currentShop.shopID;
    },
    foodTypeArr() {
      let newArr = [];
      this.foodList.forEach(item => {
        if (newArr.indexOf(item.foodType) == -1) {
          //尚未添加的分类
          newArr.push(item.foodType);
        }
      });
      return newArr;
    }
  },
  watch: {
    isShowModifyPart(newVal) {
      if (newVal) {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      } else {
        document.getElementsByTagName("body")[0].style.overflow = "auto";
      }
    },
    searchFoodItem(newVal) {
      let newArr = [];
      this.foodList.forEach(foodItem => {
        if (foodItem.foodName.includes(newVal)) {
          newArr.push(foodItem);
        }
      });
      this.searchFoodList = JSON.parse(JSON.stringify(newArr));
    }
  },
  components: {
    modifyFood
  }
};
</script>

<style lang="less" scoped>
.foodAdmin {
  .container {
    .search {
      width: 30%;
      margin-top: 2rem;
      padding-left: 3rem;
    }
    ul {
      padding: 2rem 3rem;
      text-align: left;
      .addItem {
        float: left;
        border: 1px dotted rgba(0, 0, 0, 0.4);
        background: white;
        line-height: 14rem;
        text-align: center;
        .addIcon {
          font-size: 3rem;
          color: rgba(0, 0, 0, 0.4);
        }
      }
      li {
        display: inline-block;
        height: 14rem;
        padding: 1rem;
        border: 1px solid gray;
        box-shadow: 10px 7px 20px;
        margin-right: 2rem;
        margin-bottom: 1rem;
        width: 10vw;
        text-align: left;
        border-radius: 8px;
        background: -webkit-gradient(
          linear,
          0 0,
          0 100%,
          from(#4169e1),
          to(#b0c4de)
        );
        img {
          display: block;
          margin: 0 auto;
          width: 10vw;
          height: 10vw;
        }
        .textPart {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          padding-left: 0.5rem;
          .foodName {
            font-weight: 900;
          }
          p {
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .modifyFoodPart {
      position: fixed;
      top: 8vh;
      width: 85vw;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>