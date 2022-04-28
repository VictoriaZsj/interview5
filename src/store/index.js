import Vue from "vue";
import Vuex from "vuex";

import  jwtUtil  from  'jsonwebtoken'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    xy_jwt: localStorage.getItem("xy_jwt") || "", //登录态*****
    xy_usertoken: localStorage.getItem("xy_usertoken") || "", //登录态*****
    from_domain: localStorage.getItem("from_domain") || "", //
    isHasHaiBao: "1",
    shareParam: {
      //分享接口参数
      share_img: "", //logo
      sharetxt: "", //文本
      sharetitle: "", //标题
      post_image: "", //海报分享的图片 base64
      post_url_image: "", //链接分享图片
      share_url: "", //路径
    },
    device: "", //设备环境
    accountId:'',//用户id
    mutualSchoolId:'',//双选会学校id 
    mutualSchoolName:''//双选会学校名
  },
  mutations: {
    //登录态
    loginInit(state, param) {
      state.xy_jwt = param.jwt;
      //base64解码
      state.accountId=jwtUtil.decode(param.jwt).aud;
      console.log('accountId:',state.accountId)
      state.xy_usertoken = param.usertoken;
      state.from_domain = param.from_domain;
      localStorage.setItem("accountId", state.accountId);
      
      localStorage.setItem("xy_jwt", param.jwt);
      localStorage.setItem("xy_usertoken", param.usertoken);
      localStorage.setItem("from_domain", param.from_domain);
    },
    setDevice(state, param) {
      state.device = param;
    },
    setHasHaiBao(state, param) {
      state.isHasHaiBao = param;
    },
    setShareParam(state, param) {
      state.shareParam = param;
    },
    //双选会学校信息
    SETSCHOOL_INFO(state,param){
      state.mutualSchoolId = param.mutualSchoolId;
      state.mutualSchoolName = param.mutualSchoolName;
    }
  },
});

export default store;
