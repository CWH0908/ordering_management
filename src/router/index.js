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
      redirect:"/sign"
    },
    {
      path:"/main",
      redirect:"/main/home"
    },
    {
      path:"/sign",
      name:"sign",
      components:{
        sign
      }
    },
    {
      path:"/main/home",
      name:"home",
      components:{
        home
      }
    }
  ]
})
