import Cookies from "vue-cookies";
import ComJs from "@/assets/js/common/common.js";
const strIdocUser = "idoc-user";
const strIdocAuthkeyMenu = "idoc-authkey-user";
const objDefaultUser = {
  ctmId: "",
  ehireId: "",
  oprId: "",
  oprName: "",
  subOprIds: [],
  token: "",
};
const objDefaultAuthMenu = {
  authkey: [],
  menu: [],
  menulocation: [] //面包屑
};

//获取用户信息cookie
export default {
  getUser() {
    return Cookies.get(strIdocUser)
      ? JSON.parse(ComJs.decrypt(Cookies.get(strIdocUser)))
      : objDefaultUser;
  },
  //设置用户信息cookie
  setUser(objCookieVal, intExpireTimes) {
    return Cookies.set(
      strIdocUser,
      objCookieVal ? ComJs.encrypt(JSON.stringify(objCookieVal)) : objDefaultUser,
      intExpireTimes
    );
  },
  //删除用户信息cookie
  removeUser() {
    Cookies.remove(strIdocUser);
    // this.removeAuthMenu();
  },
  //获取权限菜单栏
  getAuthMenu() {
    return localStorage.getItem(strIdocAuthkeyMenu)
      ? JSON.parse(ComJs.decrypt(localStorage.getItem(strIdocAuthkeyMenu)))
      : objDefaultAuthMenu;
  },
  //设置权限菜单栏
  setAuthMenu(objLocalstorageVal) {
    return localStorage.setItem(
      strIdocAuthkeyMenu,
      objLocalstorageVal ? ComJs.encrypt(JSON.stringify(objLocalstorageVal)) : objDefaultAuthMenu
    );
  },
  //删除权限菜单栏
  removeAuthMenu() {
    return localStorage.removeItem(strIdocAuthkeyMenu);
  }
}

