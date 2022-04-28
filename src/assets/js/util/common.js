import { Message } from "element-ui";
import MessageAlertJs from "@/assets/js/common/messagealert.js";
import CryptoJS from "crypto-js";
import { isDate } from "util";
import EnvConfigJs from "@/config/env.config";
import axios from "axios";
import router from "@/router";
import HttpJs from "@/assets/js/common/http.js";
const publicPath = ""

export default {
  //获取服务器时间
  getServerDate() {
    let objXhr = null;
    if (window.XMLHttpRequest) {
      objXhr = new window.XMLHttpRequest();
    } else {
      // ie
      objXhr = new ActiveObject("Microsoft");
    }
    objXhr.open("GET", "/?_=" + new Date().getTime(), false); //false不可变
    objXhr.send(null);
    let strDate = objXhr.getResponseHeader("Date");
    return new Date(strDate);
  },
  //日期格式化
  formatDate(objDate, strFormat, intTimezoneOffset = null) {
    let objNewDate = objDate;
    if (intTimezoneOffset != null) {
      let intNewTime =
        objDate.getTime() +
        (intTimezoneOffset * 60 + objDate.getTimezoneOffset()) * 60 * 1000;
      objNewDate = new Date(intNewTime);
    }
    let arrType = {
      //4位年
      Y: objNewDate.getFullYear(),
      //2位年
      y: this.padLeft(objNewDate.getFullYear(), "0", 2),
      //2位月，不足2位前导0
      m: this.padLeft(objNewDate.getMonth() + 1, "0", 2),
      //月，不带前导0
      n: objNewDate.getMonth() + 1,
      //2位日，不足2位前导0
      d: this.padLeft(objNewDate.getDate(), "0", 2),
      //日，不带前导0
      j: objNewDate.getDate(),
      //2位时，不足2位前导0
      H: this.padLeft(objNewDate.getHours(), "0", 2),
      //时，不带前导0
      G: objNewDate.getHours(),
      //2位分，不足2位前导0
      i: this.padLeft(objNewDate.getMinutes(), "0", 2),
      //2位秒，不足2位前导0
      s: this.padLeft(objNewDate.getSeconds(), "0", 2)
    };
    for (let strKey in arrType) {
      if (new RegExp(`(${strKey}+)`).test(strFormat)) {
        let strDate = arrType[strKey] + "";
        strFormat = strFormat.replace(RegExp.$1, strDate);
      }
    }
    return strFormat;
  },
  //日期加减函数
  dateAdd(objDate, strInterval, intNum) {
    if (!isDate(objDate)) {
      objDate = new Date(objDate.replace(/-/g, "/"));
    }
    let objNewDate = new Date(objDate);
    switch (strInterval) {
      case "Y": //4位年
      case "y": //2位年
        objNewDate.setFullYear(objDate.getFullYear() + intNum);
        if (objNewDate.getMonth() !== objDate.getMonth()) {
          objNewDate.setDate(0);
        }
        return objNewDate;
      case "m": //2位月，不足2位前导0
      case "n": //月，不带前导0
        objNewDate.setMonth(objDate.getMonth() + intNum);
        if (objNewDate.getDate() !== objDate.getDate()) {
          objNewDate.setDate(0);
        }
        return objNewDate;
      case "d": //2位日，不足2位前导0
      case "j": //日，不带前导0
        objNewDate.setDate(objDate.getDate() + intNum);
        return objNewDate;
      case "H": //2位时，不足2位前导0
      case "G": //时，不带前导0
        objNewDate.setHours(objDate.getHours() + intNum);
        return objNewDate;
      case "i": //2位分，不足2位前导0
        objNewDate.setMinutes(objDate.getMinutes() + intNum);
        return objNewDate;
      case "s": //2位秒，不足2位前导0
        objNewDate.setSeconds(objDate.getSeconds() + intNum);
        return objNewDate;
      default:
        return null;
    }
  },
  //日期对比
  checkDateTime(starttime, endtime) {
    let numStarttime = new Date(starttime.replace(/\-/g, "/"));
    let endStarttime = new Date(endtime.replace(/\-/g, "/"));
    if (endStarttime - numStarttime < 0) {
      return false;
    }
    return true;
  },
  //左侧补字母凑齐固定长度
  padLeft(strText, strChar, intLength) {
    strText = strText + "";
    return (new Array(intLength + 1).join(strChar) + strText).substr(
      strText.length
    );
  },
  //对象合并
  extend() {
    let intLength = arguments.length;
    let objTarget = arguments[0] || {};
    if (typeof objTarget !== "object" && typeof objTarget !== "function") {
      objTarget = {};
    }
    let intNum = 1;
    if (intLength === 1) {
      objTarget = this;
      intNum--;
    }
    for (intNum; intNum < intLength; intNum++) {
      let objSource = arguments[intNum];
      for (let strKey in objSource) {
        // 使用for in会遍历数组所有的可枚举属性，包括原型。
        if (Object.prototype.hasOwnProperty.call(objSource, strKey)) {
          objTarget[strKey] = objSource[strKey];
        }
      }
    }
    return objTarget;
  },
  //message显示错误提示
  showTip(strText, strType, intDuration, funCallback) {
    if (strText) {
      Message({
        message: strText,
        type: strType || "error",
        duration: intDuration || 3000,
        onClose: this.debounce(funCallback, intDuration)
      });
    }
  },
  // message弹窗
  showAlert(objData, confirmCallback, closeCallback) {
    MessageAlertJs.show(objData, confirmCallback, closeCallback);
  },
  //接口错误提示弹窗
  showAjaxErrorMsg(objReject, objConfig) {
    console.log(objReject);
    let strErrText =
      objReject && !objReject.result && objReject.msg && objReject.msg.text
        ? objReject.msg.text
        : "操作失败";
    this.showAlert(
      {
        value: strErrText,
        title: "提示",
        show_confirm_button: false,
        ...objConfig
      },
      "",
      ""
    );
  },
  //重置表单内容
  resetForm(formName, _that) {
    _that.$nextTick(() => {
      _that.$refs[formName].resetFields();
    });
  },
  /**
   * [encrypt 对密码进行加密]
   * @param  {[string]} strText [需要加密的内容]
   * @return {[string]}      [加密的密文]
   */
  encrypt(
    strText,
    strKey = EnvConfigJs.Cookie_CryptKey,
    strIV = EnvConfigJs.Cookie_CryptVi
  ) {
    let strKeyHex = CryptoJS.enc.Utf8.parse(strKey);
    let objEncrypted = CryptoJS.DES.encrypt(strText, strKeyHex, {
      mode: CryptoJS.mode.CBC, // ecb模式不需要偏移量
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(strIV)
    });
    return objEncrypted.ciphertext.toString().toUpperCase(); // 返回hex格式的密文
  },
  /**
   * [decrypt 对加密之后的密文在页面上进行解密]
   * @param  {[string]} strText [需要解密的内容]
   * @return {[string]}      [解密的明文]
   */
  decrypt(
    strText,
    strKey = EnvConfigJs.Cookie_CryptKey,
    strIV = EnvConfigJs.Cookie_CryptVi
  ) {
    let strKeyHex = CryptoJS.enc.Utf8.parse(strKey);
    let objDecrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(strText)
      },
      strKeyHex,
      {
        iv: CryptoJS.enc.Utf8.parse(strIV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return objDecrypted.toString(CryptoJS.enc.Utf8);
  },
  //生成唯一标识符
  getGuid() {
    var strTime = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      strC
    ) {
      let intRandom = (strTime + Math.random() * 16) % 16 | 0;
      strTime = Math.floor(strTime / 16);
      return (strC == "x" ? intRandom : (intRandom & 0x3) | 0x8).toString(16);
    });
  },
  // 打开窗口
  openWindow(strLink, strTarget) {
    if (!strLink) return;
    const blnHasQuery = strLink.indexOf("?") > -1;
    let strNewLink = "";
    if (blnHasQuery) {
      strNewLink = `${strLink}&t=${Date.now()}`;
    } else {
      strNewLink = `${strLink}?t=${Date.now()}`;
    }
    window.open(strNewLink, strTarget);
  },
  //关闭当前窗口
  closeWindow(strPostMsg, objPath) {
    if (
      window.opener &&
      strPostMsg &&
      typeof window.opener.postMessage === "function"
    ) {
      window.opener.postMessage(strPostMsg, "*");
    }
    if (
      !window.opener ||
      (window.opener && typeof window.opener.postMessage !== "function")
    ) {
      this.routerPush(objPath);
    } else {
      window.opener = window;
      var objWin = window.open("", "_self");
      objWin.close();
      //frame的时候
      top.close();
    }
  },
  //刷新父页面
  refreshParentWindow(strPostMsg) {
    if (
      window.opener &&
      strPostMsg &&
      typeof window.opener.postMessage === "function"
    ) {
      window.opener.postMessage(strPostMsg, "*");
    }
  },
  //保留n位小数，默认2位
  numFilter(floatNum, intNum = 2) {
    return (
      (
        Math.round(floatNum * Math.pow(10, intNum)) / Math.pow(10, intNum)
      ).toFixed(intNum) * 1
    );
  },
  // 去除后缀，获取文件名
  findName(strFile) {
    const lastIndex = strFile.lastIndexOf(".");
    return strFile.substring(0, lastIndex);
  },
  /**
   *  push 跳转路由
   * objDate；{path, query}
   */
  routerPush(objDate) {
    const { path = "", query = {} } = objDate;
    let objToQuery = query;
    if (!path) return;
    // 判断query中是否有值, 且在当前项目的路由配置表中， 且路由配置中配置了需要加密， 则加密
    const blnHasQuery = Object.keys(query).length > 0;
    const objRouteOptions = router.options ? router.options.routes : [];
    const objCurrent =
      objRouteOptions.filter(
        objItem => objItem.path.toUpperCase() === path.toUpperCase()
      ) || [];
    const blnIsHro = objCurrent.length > 0;
    // 是否不加密， 默认为加密
    let blnNoencrypt = false;
    if (
      blnIsHro &&
      ((objCurrent[0].children && objCurrent[0].children[0].meta) ||
        objCurrent[0].meta)
    ) {
      // 路由配置中如果配置了parent， 则取children， 否则直接去meta
      const { noencrypt } = objCurrent[0].children
        ? objCurrent[0].children[0].meta
        : objCurrent[0].meta;
      if (typeof noencrypt == "boolean" && noencrypt) {
        blnNoencrypt = true;
      }
    }
    if (query && blnHasQuery && blnIsHro && !blnNoencrypt) {
      let strEncrypt = this.encrypt(JSON.stringify(query));
      strEncrypt = strEncrypt ? strEncrypt.slice(0, 8) : "";
      objToQuery = {
        ...query,
        encrypt: strEncrypt
      };
    }
    // 获取路由信息
    let objRoute = router.resolve({
      path,
      query: objToQuery
    });
    // 生产环境中，跳转页面时判断版本号是否跟新
    const isProduction = process.env.NODE_ENV == "production";
    if (isProduction) {
      const { VERSION } = process.env;
      // 获取配置文件中的版本后，判断是reload页面还是router跳转
      axios
        .get(`${publicPath}/static/config/version.json?_=${Date.now()}`)
        .then(response => {
          if (
            VERSION &&
            response.status === 200 &&
            response.data &&
            VERSION != response.data.version
          ) {
            console.log("发现新版本，自动刷新");
            window.location.reload();
            return;
          }
          this.transportRoute(objRoute);
        })
        .catch(error => {
          this.transportRoute(objRoute);
        });
    } else {
      this.transportRoute(objRoute);
    }
  },
  // 路由跳转
  transportRoute(objRoute) {
    if (!objRoute) {
      return;
    }
    router.push({
      path: objRoute.route.path,
      query: objRoute.route.query || {}
    });
  },
  /**
   * @description: 复制传入的内容到剪贴板
   * @param strValue 需要被复制的值
   * @return: boolean
   */

  clipboard(strValue) {
    // 创建一个只读并且不会显示的textarea
    const el = document.createElement("textarea");
    let success = false; // 复制是否成功
    el.innerHTML = strValue;
    el.value = strValue;
    el.setAttribute("readonly", "");
    el.style.contain = "strict";
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.fontSize = "12px";

    // 选择的文本范围 默认为flase
    let originalRange = false;
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }
    document.body.appendChild(el);
    // 设置选中区域:选择对象,设置文本框中选定的文本起始点和终点
    el.select();
    el.selectionStart = 0;
    el.selectionEnd = strValue.length;
    try {
      // 拷贝当前选中内容到剪贴板
      success = document.execCommand("copy");
    } catch (err) {
      console.log("复制失败");
    }
    document.body.removeChild(el);
    if (!!originalRange) {
      // 去除所有的选中区域，然后插入当前的选中区域
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    return success;
  },
  // 常见类型的深拷贝：数组、对象、时间
  deepClone(objData) {
    let copyData;
    if (objData === null || typeof objData !== "object") return objData;

    if (objData instanceof Date) {
      copyData = new Date();
      copyData.setTime(objData.getTime());
      return copyData;
    }
    if (objData instanceof Array) {
      copyData = [];
      for (let inedx = 0, len = objData.length; inedx < len; inedx++) {
        copyData[inedx] = this.deepClone(objData[inedx]);
      }
      return copyData;
    }
    if (objData instanceof Object) {
      copyData = {};
      for (const attr in objData) {
        // 不拷贝继承的属性
        if (objData.hasOwnProperty(attr))
          copyData[attr] = this.deepClone(objData[attr]);
      }
      return copyData;
    }
  },
  //成功后弹出小提示，默认2s后消失
  showDuratioSuccMessage(strText, intDuration) {
    Message({
      customClass: "succDuraMessageBox",
      iconClass: "succDuraMessageBox-icon",
      message: strText || "保存成功",
      duration: intDuration || 2000
    });
  },
  isHasScrolled(el, direction = "vertical") {
    if (direction === "vertical") {
      //横向滚动条
      return el.scrollHeight > el.clientHeight;
    } else if (direction === "horizontal") {
      return el.scrollWidth > el.clientWidth;
    }
  },
  // trim
  strTrim(strValue) {
    if (typeof strValue !== "string") return strValue;
    return !!strValue ? strValue.trim() : "";
  },
  /**
   * @description: 根据objData对象的path路径获取值, 如果解析值是undefined，就返回一个默认的值
   * @param {*} objData 原始值对象
   * @param {*} objPath 路径
   * @param {*} strDefault 默认值
   *  const object = { a: [{ b: { c: 3 } }] };
   *  get(object, "a[1].b.c")
   *  get(object, "a.0.b.c", "default")
   */
  get(objData, objPath, strDefault = "undefined") {
    if (!objData) return strDefault;
    // 先将path处理成统一格式
    let objNewPath = [];
    if (Array.isArray(objPath)) {
      objNewPath = objPath;
    } else {
      // 先将字符串中的'['、']'去除替换为'.'，split分割成数组形式
      objNewPath = objPath
        .replace(/\[/g, ".")
        .replace(/\]/g, "")
        .split(".");
    }
    return (
      objNewPath.reduce((objResult = {}, strCurrent) => {
        return objResult[strCurrent];
      }, objData) || strDefault
    );
  },

  /**
   * @description: 下载本地文件
   * @param {*} strPath 文件相对路径
   * @param {*} strFileName 下载文件名
   * @return {*}
   */
  downloadLocalFile(strPath, strFileName = "") {
    HttpJs.get(
      strPath,
      {},
      {
        responseType: "blob"
      }
    )
      .then(data => {
        if (data) {
          return data;
        }
        return Promise.reject();
      })
      .then(objRes => {
        if ("msSaveOrOpenBlob" in navigator) {
          window.navigator.msSaveOrOpenBlob(
            new Blob([objRes.data]),
            strFileName
          );
          return;
        }
        // IE10以上支持blob但是依然不支持download
        if ("download" in document.createElement("a")) {
          //支持a标签download的浏览器
          const objLink = document.createElement("a");
          objLink.download = strFileName;
          objLink.style.display = "none";
          objLink.href = window.URL.createObjectURL(new Blob([objRes.data]));
          document.body.appendChild(objLink);
          objLink.click(); // 执行下载
          window.URL.revokeObjectURL(objLink.href); // 释放url
          document.body.removeChild(objLink);
        } else {
          // 其他浏览器
          navigator.msSaveBlob(new Blob([objRes.data]), strFileName);
        }
      })
      .catch(objE => {
        this.showTip("下载失败");
      });
  },
  //金额保留intCount，不足补零，默认两位
  moneyFloat(floatValue, intCount = 2) {
    floatValue = this.numFilter(floatValue, intCount);
    const arrSp = floatValue.toString().split(".");
    if ((arrSp[1] || "").length < intCount) {
      let intFloatNum = intCount - (arrSp[1] || "").length; //需要补0的位数
      floatValue =
        arrSp[0].toString() +
        "." +
        (arrSp[1] || "").toString() +
        "0".repeat(intFloatNum);
    }
    return floatValue;
  },
  //获取url域名
  getUrlDomain(strUrl) {
    if (!strUrl) {
      return "";
    }
    let arrUrl = strUrl.split("/");
    if (arrUrl.length >= 3) {
      return arrUrl[2];
    } else {
      return "";
    }
  },
  //防抖动
  debounce(funFn, intWait) {
    let objTimer = null;
    return () => {
      if (objTimer !== null) {
        clearTimeout(objTimer);
      }
      objTimer = setTimeout(funFn, intWait);
    };
  },
  /**
   * @description: 根据某个标识获取数组中对应标识对象的中的某个值
   * @param {*} strIndexVal 对应标识值
   * @param {*} strIndexKey 标识
   * @param {*} strGetKey 需要获取值的标识
   * @param {*} arrSelopts 需要遍历的数组
   */
  getSelectOptionVal(strIndexVal, strIndexKey, strGetKey, arrSelopts = []) {
    let strRet = "";
    (arrSelopts || []).every(objOpts => {
      if (objOpts[strIndexKey] === strIndexVal) {
        strRet = objOpts[strGetKey];
        return false;
      }
      return true;
    });
    return strRet;
  },
  //去登录页
  toLogin() {

  },
  //去错误页面
  toErrorPage() {

  },
  //金额格式化，转成k
  transferMoney(decNum) {
    if (!decNum && decNum !== 0) {
      return "";
    }
    if (decNum >= 10000 || -10000 >= decNum) {
      let strResult = "";
      let intCounter = 0;
      let decNum1 = Math.round(decNum / 1000);
      let decNum2 = (decNum1 || 0).toString();
      for (let i = decNum2.length - 1; i >= 0; i--) {
        intCounter++;
        strResult = decNum2.charAt(i) + strResult;
        if (!(intCounter % 3) && i != 0 && decNum2[i - 1] != "-") {
          strResult = "," + strResult;
        }
      }
      return strResult + "k";
    } else {
      return Math.round(decNum);
    }
  },
  //金额格式化，逗号隔开，默认保留两位小数
  toThousands(decNum, intNum = 2) {
    var strResult = "",
      intCounter = 0,
      blnStartFlag = 1,
      blnEndFlag = 0;
    if (!decNum && decNum !== 0) {
      return "";
    }
    if (decNum < 0) {
      blnEndFlag = 1;
    } else {
      blnEndFlag = 0;
    }
    let strNum = this.moneyFloat(decNum || 0, intNum).toString();
    if (strNum.indexOf(".") !== -1) {
      blnStartFlag = intNum + 1 + 1;
    } else {
      blnStartFlag = 1;
    }
    for (var i = strNum.length - blnStartFlag; i >= 0; i--) {
      intCounter++;
      strResult = strNum.charAt(i) + strResult;
      if (!(intCounter % 3) && i > blnEndFlag) {
        strResult = "," + strResult;
      }
    }
    return (
      strResult + strNum.slice(strNum.length - blnStartFlag + 1, strNum.length)
    );
  },
  //是否在下拉框选项中
  isInSelect(strCode, arrList = [],strKeyCode='code') {
    return arrList.some(objI => {
      return objI[strKeyCode] == strCode;
    });
  }
};
