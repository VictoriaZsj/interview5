import HttpJs from "@/assets/js/common/http.js";
import CommonJs from "@/assets/js/common/common.js";
import UserJs from "@/assets/js/common/user.js";

import EnvConfigJs from "@/config/env.config";
import store from "@/store";

export default {
  //显示loading
  showLoading() {
    HttpJs.showLoading();
  },
  //关闭loading
  closeLoading() {
    HttpJs.closeLoading();
  },
  //通过blob方式下载
  downloadByBlob(objResponse) {
    let arrRes = objResponse.data;
    const objBlob = new Blob([arrRes], {
      type: "application/octet-binary"
    }); // 构造一个blob对象来处理数据
    //读取文件名
    if (!objResponse.headers["content-disposition"]) {
      let strResult = "";
      let objResult = new DataView(arrRes);
      for (let intNum = 0; intNum < objResult.byteLength; intNum++) {
        strResult += String.fromCharCode(objResult.getUint8(intNum));
      }
      return strResult;
    } else {
      let strCD = objResponse.headers["content-disposition"];
      /(filename=")(.+)(")/.test(strCD);
      let strFileName = decodeURI(RegExp.$2) || "";
      if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(objBlob, strFileName);
        return;
      }
      // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
      // IE10以上支持blob但是依然不支持download
      if ("download" in document.createElement("a")) {
        // 支持a标签download的浏览器
        const objLink = document.createElement("a"); // 创建a标签
        objLink.download = strFileName; // a标签添加属性
        objLink.style.display = "none";
        objLink.href = URL.createObjectURL(objBlob);
        document.body.appendChild(objLink);
        objLink.click(); // 执行下载
        URL.revokeObjectURL(objLink.href); // 释放url
        document.body.removeChild(objLink); // 释放标签
      } else {
        // 其他浏览器
        navigator.msSaveBlob(objBlob, strFileName);
      }
      return "";
    }
  },
  /**
   * [requestApi description]
   * @param  {[string]} strUrl        [url]
   * @param  {[string]} strOprType    [oprtype]
   * @param  {[object]} arrData       [传递参数]
   * @param  {[object]} arrAttribute  [isdownload:bool类型 是否下载,isupload:bool类型 是否上传,params:参数,config:配置]
   * @return {[Promise]}              [返回promise]
   */
  requestApi(strUrl, arrData, arrAttribute) {
    //获取接口路径
    strUrl = ApiUrl_Crm + strUrl;
    return this.getApiResult("requestApi", strUrl, arrData, arrAttribute);
  },
  //返回Api调用结果
  getApiResult(strApiType, strUrl, arrParams, arrAttribute) {
    //组合参数
    if (arrAttribute && arrAttribute.params) {
      arrParams = CommonJs.extend(arrParams, arrAttribute.params);
    }
    //组合配置
    let arrConfig = {};
    if (arrAttribute && arrAttribute.config) {
      arrConfig = arrAttribute.config;
    }
    //是否隐藏loading
    if (arrAttribute && arrAttribute.unloading) {
      arrConfig = CommonJs.extend(arrConfig, {
        unloading: arrAttribute.unloading
      });
    }
    //上传
    if (arrAttribute && arrAttribute.isupload) {
      arrConfig["headers"] = CommonJs.extend(arrConfig["headers"] || {}, {
        "Content-Type": "multipart/form-data"
      });
    }
    //下载
    if (arrAttribute && arrAttribute.isdownload) {
      return new Promise((resolve, reject) => {
        HttpJs.download(strUrl, arrParams, arrConfig)
          .then(response => {
            let strFailRes = this.downloadByBlob(response);
            if (strFailRes) {
              try {
                reject(JSON.parse(strFailRes));
              } catch (err) {
                reject(err);
              }
              return;
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
    //返回结果
    return new Promise((resolve, reject) => {
      HttpJs.post(strUrl, arrParams, arrConfig)
        .then(response => {
          resolve(response.data.data || {});
        })
        .catch(objErr => {
          let { data = {} } = objErr;
          this.errHandle(objErr);
          reject(data);
        });
    });
  },
  //统一错误处理
  errHandle(objErr) {
    let { isWebErr, data = {} } = objErr;
    if (isWebErr) {
      //网络问题
      let { status } = objErr;
      switch (status) {
        case 401: //token过期
          CommonJs.showTip(data.message);
          //清除token
          UserJs.removeUser();
          setTimeout(() => {
            CommonJs.routerPush({
              path: "/home/login"
            });
          }, 1000);
          break;
        default:
          CommonJs.showTip(data.message);
          break;
      }
    } else {
      //接口错误
      let { code, message } = data;
      switch (code) {
        case 401:
          CommonJs.routerPush({
            path: "/home/login"
          });
          break;
        case 403: //token过期
          UserJs.removeUser();
          CommonJs.showTip(message);
          //清除token
          setTimeout(() => {
            CommonJs.routerPush({
              path: "/home/login"
            });
          }, 1000);
          break;
        default:
          CommonJs.showTip(message);
          break;
      }
    }
  }
};
