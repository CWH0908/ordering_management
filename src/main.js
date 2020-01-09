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
  Switch
} from 'vant';
Vue.use(DropdownMenu).use(DropdownItem);
Vue.use(Collapse).use(CollapseItem);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Field);
Vue.use(Button);
Vue.use(Switch)
// Vue.use(Vant);


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
