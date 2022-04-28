<template>
  <div id="app">
    <transition>
      <router-view ></router-view>
      <!-- <router-view v-if="isLogin"></router-view> -->
    </transition>
  </div>
</template>
<script>
import store from '@/store'
import qs from 'qs'
export default {
  name: 'App',
  data () {
    return {
      isLogin:false,//获取到登录态才访问页面
    }
  },
 
  methods: {
    //获取登录态
    getLogin(param){
      // if(param.r)returnf
      let device = store.state.device
      //小程序中获取
      // if(param.jwt && param.usertoken){
      //   store.commit('loginInit',{'jwt':param.jwt,'usertoken':param.usertoken,'from_domain':param.from_domain})
      //   this.isLogin = true
      //   return
      // }
      if (device == 'wechat')return
      //android中获取
      if(device == 'android'){
        let logininfo = android.getLoginUserInfo()//触发android登陆事件
        console.log('android-logininfo:',logininfo)
        if(logininfo){
          store.commit('loginInit',{'jwt':JSON.parse(logininfo)['xy-jwt'],'usertoken':JSON.parse(logininfo)['xy-user-token'],'from_domain':JSON.parse(logininfo)['from-domain']})
          this.isLogin = true
        }
        return 
      //ios中获取
      }else if(device == 'ios'){
        localStorage.setItem('xy_jwt', '')
        localStorage.setItem('xy_usertoken', '')
        // console.log(11111)//触发ios登陆事件
        window.webkit.messageHandlers.model.postMessage(["getUserLoginInfo:",{"callback":"app_callback_giveToken"}])

        return
      }
    }
  },
   created() {
    console.log('qs:',qs)
    //获取设备名称
    let u = navigator.userAgent
    if (u.toLowerCase().match(/miniProgram/i) == "miniprogram") {
      store.commit('setDevice','wechat')
    } else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
      store.commit('setDevice','android')
    } else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
      store.commit('setDevice','ios')
    }
    //不用登陆的页面
    if(location.pathname == '/explain' || location.pathname == '/wikiinfo' || location.pathname == '/explore' || location.pathname == '/login'){
      this.isLogin = true
      return
    }
    const param = qs.parse(location.search.substring(1))
    this.isLogin = false
    //获取登录态
    this.getLogin(param)
    console.log('loginParam:',param)
  },
  mounted(){
    let device = store.state.device
    //给ios登录态的回调
    window['app_callback_giveToken'] = (logininfo)=>{
      console.log('ios-logininfo:',logininfo)
      if(logininfo && logininfo['xy-jwt']){
        store.commit('loginInit',{'jwt':logininfo['xy-jwt'],'usertoken':logininfo['xy-user-token'],'from_domain':logininfo['from-domain']})
        this.isLogin = true
      }else{
        window.location = 'xiaoyuan://home/exitCurrentPage'
      }
    };
    //给android登录态的回调
    window['onLoginSuccess'] = (logininfo)=>{
      if(logininfo){
        store.commit('loginInit',{'jwt':JSON.parse(logininfo)['xy-jwt'],'usertoken':JSON.parse(logininfo)['xy-user-token'],'from_domain':JSON.parse(logininfo)['from-domain']})
        this.isLogin = true
        // this.$router.go(0)
        window.location.reload()
      }else{
        window.location = 'xiaoyuan://home/exitCurrentPage'
      }
    }
    //回退到app 给android用的
    window['onLoginCancel'] = (info)=>{
      android.closeWebView()
    }
    // // APP头部点分享用的方法 
    // window['appShare'] = ()=>{
    //   if(device == 'android') {
    //     android.jsAppBridgeShare(JSON.stringify(store.state.shareParam))
    //   } else if(device == 'ios') {
    //     let obj=JSON.parse(JSON.stringify(store.state.shareParam))
    //     window.webkit.messageHandlers.model.postMessage(["jsAppBridgeShare:",obj])
    //   }
    // }
    //分享是否有海报  1-有海报  0-无海报
    // window['appShareHaiBao'] = ()=>{
    //   return store.state.isHasHaiBao
    // }
  }
}
</script>

<style lang='less' scoped>
@import '../src/styles/app.less';
</style>
