// import ApiJs from "@/assets/js/common/api.js";
// import UserJs from "@/assets/js/common/user.js";
let _that = this;

export default {
  //回退App

  goBackAPP(){
    window.location = 'xiaoyuan://home/exitCurrentPage'
  },
  zsjTest(){
    console.log('zsjTest')
  },
  // //获取用户权限
  // getAuthority() {
  //   return ApiJs.requestApi("suppliers/dict/authority/query");
  // },
  // //验证权限
  // checkAuth(strAuthKey, arrAuthKey) {
  //   if (strAuthKey) {
  //     if (arrAuthKey == undefined) {
  //       arrAuthKey = UserJs.getAuth().authkey;
  //     }
  //     if (typeof strAuthKey == "string") {
  //       //字符串
  //       return arrAuthKey.indexOf(strAuthKey) >= 0;
  //     } else if (
  //       Object.prototype.toString.call(strAuthKey) === "[object Array]"
  //     ) {
  //       //二维数组 例如：[[a,b],c]，满足权限条件(a&b)||c
  //       return strAuthKey.some(arrKey => {
  //         if (typeof arrKey == "string") {
  //           return arrAuthKey.indexOf(arrKey) >= 0;
  //         } else if (
  //           Object.prototype.toString.call(arrKey) === "[object Array]"
  //         ) {
  //           return arrKey.every(strKey => {
  //             return arrAuthKey.indexOf(strKey) >= 0;
  //           });
  //         } else {
  //           return false;
  //         }
  //       });
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // }
};
