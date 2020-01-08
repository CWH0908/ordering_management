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
        <modifyFood :currentFoodItem="currentFoodItem" :foodTypeArr="foodTypeArr"></modifyFood>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFoodList } from "../../API/getFoodList";
import modifyFood from "../foodAdmin/modifyFood";
export default {
  created() {
    this._getFoodList();
  },
  data() {
    return {
      foodList: [], //获取的菜品信息
      isShowModifyPart: false, //是否显示编辑框
      currentFoodItem: {} //当前点击的菜品信息传值到编辑框
    };
  },
  methods: {
    async _getFoodList() {
      this.foodList = await getFoodList(this.shopID);
    },
    //打开菜品修改框
    openModify(item) {
      this.currentFoodItem = item;
      this.isShowModifyPart = true;
    },
    //关闭编辑框
    changeIsShow() {
      this.isShowModifyPart = false;
    }
  },
  computed: {
    ...mapGetters(["currentShop"]),
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