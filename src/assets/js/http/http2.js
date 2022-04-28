import axios from "axios";
import Qs from "qs";
// import {
//   Loading
// } from "element-ui";
// import CommonJs from "@/assets/js/common/common.js";
import UserJs from "@/assets/js/common/user.js";

const CommonJs = require('../common').default
axios.defaults.timeout = 1000 * 12; //响应时间1000 * 12
axios.defaults.headers.post["Content-Type"] ="application/x-www-form-urlencoded;charset=UTF-8"; //配置请求头
axios.defaults.baseURL = ""; //配置接口地址


/**
 * 请求失败后的错误统一处理 （外层）
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, message) => {
  let strErrMsg = "";
  // 状态码判断
  switch (status) {
    case 400:
      strErrMsg = "请求语法错误！";
      break;
      // 401: token过期
    case 401:
      strErrMsg = "登录过期，请重新登录！";
      break;
      // 403 禁止访问
    case 403:
      strErrMsg = "禁止访问！";
      break;
      // 404请求不存在
    case 404:
      strErrMsg = "请求的资源不存在！";
      break;
    case 408:
      strErrMsg = "请求超时，请稍后重试！";
      break;
    case 410:
      strErrMsg = "请求的资源不存在！";
      break;
    case 500:
      strErrMsg = "系统内部错误！";
      break;
    case 504:
      strErrMsg = "响应超时，请稍后重试！";
      break;
    default:
      strErrMsg = message;
  }
  return strErrMsg;
};
// 内层响应状态码处理函数
const codeErrorHandle = (status, message) => {
  let strErrMsg = message;
  // 状态码判断
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        // 无访问权限
        break;
      case 403:
        strErrMsg = "登录过期，请重新登录";
        break;
        // 404请求不存在
      case 404:
        strErrMsg = "请求的资源不存在";
        break;
      default:
        strErrMsg = message;
        break;
    }
  } else if (status >= 500 && status < 600) {
    strErrMsg = "系统内部错误";
  }
  return strErrMsg;
};
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    let objUser = UserJs.getUser();
    // console.log(objUser)
    // token 设置到请求头
    objUser.token && (config.headers.authtoken = objUser.token);
    if (config.headers["Content-Type"] === "multipart/form-data") {
      let arrData = config.data;
      let objFormData = new FormData();
      for (const strKey in arrData) {
        if (arrData.hasOwnProperty(strKey)) {
          if (strKey.endsWith("[]")) {
            arrData[strKey].forEach(objItem => {
              objFormData.append(strKey, objItem);
            });
          } else {
            objFormData.append(strKey, arrData[strKey]);
          }
        }
      }
      config.data = objFormData;
    } else if (config.headers["Content-Type"] === "application/json") {
      // 数据格式不需要处理
    } else {
      config.data = Qs.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    if (response.data.code >= 400 && response.data.code <= 600) {
      //失败状态值
      response.data.message = codeErrorHandle(
        response.data.code,
        response.data.message
      );
      CommonJs.showTip(response.data.message);
      return Promise.reject(response);
    } else {
      return Promise.resolve(response);
    }
  },
  error => {
    let {
      response
    } = error;
    if (response) {
      response.data = {};
      response.data.message = errorHandle(
        response.status,
        response.data.message
      );
      CommonJs.showTip(response.data.message);
      response.isWebErr = true; //区分是网络错误
      return Promise.reject(response);
    } else {
      response = {
        data: {},
        isWebErr: true
      };
      if (!window.navigator.onLine) {
        response.data.message = "网络连接存在问题，请稍后重试！";
      } else if (
        error.code === "ECONNABORTED" &&
        error.message.indexOf("timeout") !== -1
      ) {
        response.data.message = "网络超时，请稍后重试！";
      } else {
        response.data.message = "请求无响应！";
      }
    }
    return Promise.reject(response);
  }
);

//导出
export default {
 
  //返回一个Promise(发送post请求)
  post(strUrl, arrParams, arrConfig) {
    //显示loading
    showLoading(arrConfig);
    return new Promise((resolve, reject) => {
      axios.post(strUrl, arrParams, arrConfig)
        .then(response => {
          resolve(response);
          //关闭loading
          closeLoading(arrConfig);
        })
        .catch(error => {
          reject(error);
          console.log(error);
          //关闭loading
          closeLoading(arrConfig);
          Toast.fail(error.data.message);
        //   Message.error(error.data.message);
        });
    });
  },
  //返回一个Promise(发送get请求)
  get(strUrl, arrParams, arrConfig) {
    //显示loading
    showLoading(arrConfig);
    arrConfig = CommonJs.extend(arrConfig || {}, {
      params: arrParams
    });
    return new Promise((resolve, reject) => {
      axios.get(strUrl, arrConfig)
        .then(response => {
          resolve(response);
          //关闭loading
          closeLoading(arrConfig);
        })
        .catch(error => {
          reject(error);
          console.log(error);
          //关闭loading
          closeLoading(arrConfig);
          Message.error(error.data.message);
        });
    });
  },
  //下载
  download(strUrl, arrParams, arrConfig) {
    //显示loading
    showLoading(arrConfig);
    arrConfig = CommonJs.extend(arrConfig || {}, {
      method: "post",
      url: strUrl,
      responseType: "arraybuffer",
      data: arrParams
    });
    return new Promise((resolve, reject) => {
      axios(arrConfig)
        .then(response => {
          resolve(response);
          //关闭loading
          closeLoading(arrConfig);
        })
        .catch(error => {
          reject(error);
          console.log(error);
          Message.error(error.data.message);
          //关闭loading
          closeLoading(arrConfig);
        });
    });
  }
};
