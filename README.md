# graduation_management

# cwh_毕业设计 订餐系统管理端

### 搭好大体页面布局

### foodAdmin组件的编辑框布局完成，剩余（增删改逻辑功能，上传图片功能待完成）

### modifyFood.vue 组件的改删查菜品操作完成，已在vuex和数据库中同步更新，剩余（增加菜品的逻辑）

### 完成增加菜品逻辑，modifyFood.vue组件剩余（上传图片到服务器）

### 完成上传图片到七牛云服务器逻辑，modifyFood.vue组件剩余（修改菜品时回显之前的菜品图片）

### 2020-01-10  完成modifyFood.vue组件，完成菜品管理逻辑，并把上传图片封装成upload.vue组件

### 2020-01-10 晚上 完成typeAdmin.vue分类管理板块的菜品类型删改查操作，剩余（在foodAdmin组件中加入可以添加新分类的操作）

### 2020-01-11 上午 完成菜品类型的新增，准备开始做店铺管理板块

### 2020-01-11  下午 完成店铺管理板块的页面结构，正在我只做店铺数据编辑框，剩余（暂时关门，和存储数据到vuex和数据库的逻辑）

### 2020-01-12  上午 店铺管理板块完成，已将数据保存在vuex和数据库，剩余（在客户端增设对营业时间和临时关门等逻辑的商家信息组件展示）

### 2020-01-14  凌晨  加入实时接收订单情况

### 2020-01-14  下午  订单管理板块实现接收数据和查看订单详情 剩余（页面接收新订单时的提醒样式，同意或拒绝用户取消订单的操作）

### 2020-01-15  凌晨  加入了接收新订单时的消息提示和查看新订单的数据，剩余（接收客户端的取消清单请求以及改造客户端的订单为webSocket长连接）

### 2020-01-17  凌晨，完成数据统计板块的柱状图数据展示部分，并使用vue-fullpage拓展优化展示，剩余（折线图、饼图）


> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
