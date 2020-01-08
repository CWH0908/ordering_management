import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from "../components/home.vue"
import sign from "../components/sign/sign.vue"

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      redirect: "/sign"
    },
    {
      path: "/main",
      redirect: "/main/home/foodAdmin"
    },
    {
      path: "/sign",
      name: "sign",
      components: {
        sign
      }
    },
    {
      path: "/main/home",
      name: "home",
      components: {
        home
      },
      children: [{
        path: "foodAdmin",
        name: "foodAdmin",
        components: {
          "foodAdmin": resolve => require(["../components/body/foodAdmin.vue"], resolve)
        }
      }, {
        path: "orderAdmin",
        name: "orderAdmin",
        components: {
          "orderAdmin": resolve => require(["../components/body/orderAdmin.vue"], resolve)
        }
      }, {
        path: "shopInfoAdmin",
        name: "shopInfoAdmin",
        components: {
          "shopInfoAdmin": resolve => require(["../components/body/shopInfoAdmin.vue"], resolve)
        }
      }, {
        path: "typeAdmin",
        name: "typeAdmin",
        components: {
          "typeAdmin": resolve => require(["../components/body/typeAdmin.vue"], resolve)
        }
      }, {
        path: "dataStatistics",
        name: "dataStatistics",
        components: {
          "dataStatistics": resolve => require(["../components/body/dataStatistics.vue"], resolve)
        }
      }, ]
    }
  ]
})
