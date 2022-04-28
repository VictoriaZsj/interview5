// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import store from './store'

// import Vconsole from 'vconsole';
// const vConsole = new Vconsole()


import 'vant/lib/index.css';
import auth from './assets/js/auth.js'

Vue.use(Vant);
// Vue.use(vConsole)
Vue.config.productionTip = false

// Vue.prototype.$test=auth.zsjTest
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  
  console.log('to',to)
  document.title=to.meta[0]
  next()
  // console.log('title：',document.title)

})

// console.log(this.$test())
// let obj={
//   aaa:'999',
//   A:function (){
//     // this.aaa=33;
//     objB.call(this)
//   }
// }


// function objB(){
//   // this.aaa='zsj';
//   console.log(this.aaa)
// }

// obj.A()
// // function C(){
// //   obj.A.call(this)
// // }

