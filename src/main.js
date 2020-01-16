// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

//引入 vant
// import Vant from 'vant';
import 'vant/lib/index.css';
import {
  Field,
  Button,
  DropdownMenu,
  DropdownItem,
  Collapse,
  CollapseItem,
  RadioGroup,
  Radio,
  Switch,
  Uploader
} from 'vant';
Vue.use(DropdownMenu).use(DropdownItem);
Vue.use(Collapse).use(CollapseItem);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Field);
Vue.use(Button);
Vue.use(Switch)
Vue.use(Uploader)
// Vue.use(Vant);

//按需引入 echarts
import ECharts from 'vue-echarts'
//折线图
import 'echarts/lib/chart/line'
// 柱状图
import 'echarts/lib/chart/bar';
Vue.component('chart', ECharts)
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

// 引入fullpage
import VueFullpage from 'vue-fullpage.js'
Vue.use(VueFullpage)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  store,
  template: '<App/>'
})
