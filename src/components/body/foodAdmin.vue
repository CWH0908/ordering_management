<template>
  <div class="foodAdmin">
    <div class="container">
      <ul>
        <li v-for="(item,index) in foodList" :key="index" @click="openModify(item)">
          <div>
            <img :src="item.pic_url" alt />
            <div class="textPart">
              <p>{{item.foodName}}</p>
              <p>{{item.foodInfo}}</p>
              <p>￥{{item.newMoney}}</p>
            </div>
          </div>
        </li>
      </ul>
      <div class="modifyFoodPart" v-if="isShowModifyPart" @click.self="changeIsShow">
        <modifyFood
          :currentFoodItem="currentFoodItem"
          :foodTypeArr="foodTypeArr"
          @saveButton="saveButton"
          @cancelButton="changeIsShow"
          @deleteButton="deleteButton"
        ></modifyFood>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import modifyFood from "../foodAdmin/modifyFood";
import { Toast } from "vant";
import { updateFoodList, deleteFoodItem } from "../../API/updateFoodList";
export default {
  data() {
    return {
      isShowModifyPart: false, //是否显示编辑框
      currentFoodItem: {} //当前点击的菜品信息传值到编辑框
    };
  },
  methods: {
    ...mapMutations({
      set_foodList: "set_foodList"
    }),
    //打开菜品修改框
    openModify(item) {
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
    ul {
      padding: 2rem 3rem;
      text-align: left;

      li {
        display: inline-block;
        padding: 1rem;
        border: 1px solid gray;
        margin-right: 2rem;
        margin-bottom: 1rem;
        width: 14vw;
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
          width: 14vw;
        }
        .textPart {
          p {
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