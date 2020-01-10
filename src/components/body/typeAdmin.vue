<template>
  <div class="typeAdmin">
    <el-table :data="tableData" style="width: 100%" borders stripe>
      <el-table-column label="类型" width="280">
        <template slot-scope="scope">
          <el-input
            disabled
            @change="typeChange(scope.row.type)"
            class="typeInput is-disabled"
            v-model="scope.row.type"
            placeholder="请输入内容"
          ></el-input>
          <!-- <span style="margin-left: 10px">{{ scope.row.type }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="数量" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>类型: {{ scope.row.type }}</p>
            <p>数量: {{ scope.row.count }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.count }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-show="isShowSaveButton" type="primary" @click="handleSave">保存</el-button>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import {
  updateFoodList,
  modifyFoodType,
  removeFoodType
} from "../../API/updateFoodList";
import { Toast } from "vant";

export default {
  data() {
    return {
      isShowSaveButton: false
    };
  },
  computed: {
    ...mapGetters(["currentShop", "foodList"]),
    foodTypeArr() {
      let newArr = [];
      this.foodList.forEach(item => {
        if (newArr.indexOf(item.foodType) == -1) {
          //尚未添加的分类
          newArr.push(item.foodType);
        }
      });
      return newArr;
    },
    tableData() {
      let newArr = [];
      for (let i = 0; i < this.foodTypeArr.length; i++) {
        let newObj = {};
        newObj.type = JSON.parse(JSON.stringify(this.foodTypeArr[i]));

        let tempCount = 0;
        this.foodList.forEach(item => {
          if (newObj.type == item.foodType) {
            tempCount++;
          }
        });

        newObj.count = tempCount;

        newArr.push(newObj);
      }
      return newArr;
    }
  },
  methods: {
    ...mapMutations({
      set_foodList: "set_foodList"
    }),
    //表格行颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //编辑按钮
    handleEdit(index, row) {
      document
        .getElementsByClassName("typeInput")
        [index].classList.remove("is-disabled");
      document.getElementsByTagName("input")[index].removeAttribute("disabled");
      console.log(index, row);
      this.isShowSaveButton = true; //有修改后出现保存按钮
    },
    //保存
    handleSave() {
      //将foodList中foodType为this.foodTypeArr[i] 的值 设为 this.tableData[i].type
      let newTypeArr = [];
      for (let i = 0; i < this.foodTypeArr.length; i++) {
        if (this.foodTypeArr[i] != this.tableData[i].type) {
          let newObj = {};
          newObj.oldType = this.foodTypeArr[i];
          newObj.newType = this.tableData[i].type;
          newTypeArr.push(newObj);
        }
      }
      //在数据库中更新foodList
      console.log("在数据库中更新的数据:", newTypeArr);
      modifyFoodType(JSON.stringify(newTypeArr));

      this.foodList.forEach(foodItem => {
        for (let index in newTypeArr) {
          if (foodItem.foodType == newTypeArr[index].oldType) {
            foodItem.foodType = JSON.parse(
              JSON.stringify(newTypeArr[index].newType)
            );
            //在数据库中更新foodList
            // console.log("在数据库中更新的数据:", foodItem.foodType);
            // updateFoodList(foodItem.foodID, foodItem);
          }
        }
      });

      // 在veux中更新foodList;
      this.set_foodList(this.foodList);

      //保存后，将所有输入框设为不可点击
      let typeInput = Array.from(document.getElementsByClassName("typeInput"));
      let input = Array.from(document.getElementsByTagName("input"));
      for (let i = 0; i < typeInput.length; i++) {
        typeInput[i].classList.add("is-disabled");
        input[i].setAttribute("disabled", "disabled");
      }
      //隐藏保存按钮
      this.isShowSaveButton = false;
    },
    //编辑
    typeChange(type) {
      // this.isShowSaveButton = true; //有修改后出现保存按钮
      // console.log("编辑后的值", type);
    },
    //删除
    handleDelete(index, row) {
      if (this.isShowSaveButton) {
        Toast("请先保存修改后进行删除");
      } else {
        this.$confirm("此操作将永久删除该分类及其菜品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteFoodType(this.foodTypeArr[index]);
            Toast("已删除该分类及其所有菜品");
          })
          .catch(() => {});
        // console.log(index, row);
      }
    },
    deleteFoodType(foodType) {
      let foodList = [];
      for (let i = 0; i < this.foodList.length; i++) {
        let temp = this.foodList[i].foodType;
        if (this.foodList[i].foodType != foodType) {
          foodList.push(this.foodList[i]);
        }
      }
      //在vuex中删除
      this.set_foodList(foodList);
      //在数据库中删除
      removeFoodType(foodType);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table {
  padding: 2rem;
  /deep/ .cell {
    text-align: center;
  }
  /deep/ .warning-row {
    background: #409eff;
  }

  /deep/ .success-row {
    background: #409eff;
  }
}
.typeInput {
  // display: none;
}
</style>