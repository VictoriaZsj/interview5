export default {
  // 验证身份证是否合法
  checkIDCard(numIdCrad) {
    numIdCrad = numIdCrad.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(numIdCrad)) {
      console.log(
        "输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。"
      );
      return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = numIdCrad.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = numIdCrad.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(
        "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
      );
      var bGoodDay;
      bGoodDay =
        dtmBirth.getYear() == Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
        dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bGoodDay) {
        console.log("输入的身份证号里出生日期不对！");
        return false;
      } else {
        //将15位身份证转成18位
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        var arrCh = new Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        var nTemp = 0,
          i;
        numIdCrad =
          numIdCrad.substr(0, 6) +
          "19" +
          numIdCrad.substr(6, numIdCrad.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += numIdCrad.substr(i, 1) * arrInt[i];
        }
        numIdCrad += arrCh[nTemp % 11];
        return true;
      }
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = numIdCrad.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(
        arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
      );
      var bGoodDay;
      bGoodDay =
        dtmBirth.getFullYear() == Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
        dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bGoodDay) {
        console.log("输入的身份证号里出生日期不对！");
        return false;
      } else {
        //检验18位身份证的校验码是否正确。
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        var arrCh = new Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        var nTemp = 0,
          i;
        for (i = 0; i < 17; i++) {
          nTemp += numIdCrad.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != numIdCrad.substr(17, 1)) {
          console.log("18位身份证的校验码不正确！"); //应该为： + valnum
          return false;
        }
        return true;
      }
    }
    return false;
  },
  // 验证手机号
  checkMobile(numPhone) {
    return /^(1[3456789]{1,1}[0-9]{9,9})$/.test(numPhone);
  },
  // 验证座机
  checkTelphone(numPhone) {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(numPhone);
  },
  // 验证手机或电话
  checkMobileAndTel(numPhone) {
    return /^((\d+-\d+(-\d+)?)|(\d{11,11}))$/.test(numPhone);
  },
  // 验证邮箱
  checkEmail(strEmail) {
    const regExp = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return regExp.test(strEmail);
  },
  // 验证多个邮箱
  checkEmails(strEmail) {
    const regExp = /^(([a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)\;)*([a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)(\;)?$/;
    return regExp.test(strEmail);
  },
  //验证正整数
  checkPositiveInt(intNum) {
    const regExp = /^[1-9][0-9]*$/;
    return regExp.test(intNum);
  },
  //验证只含有数字
  checkIsOnlyNumber(intNum) {
    const regExp = /(^[0-9]*$)/;
    return regExp.test(intNum);
  },
  //验证只含有大写字母或数字
  checkIsOnlyNumOrWord(strWord) {
    const regExp = /(^[0-9A-Z]*$)/;
    return regExp.test(strWord);
  },
  //验证字母或数字
  checkIsLetterAndNum(strWord) {
    const regExp = /(^[0-9a-zA-Z]+$)/;
    return regExp.test(strWord);
  },
  // 去除前后空格之后验证是否为空
  validateEmpty(objRule, strValue, callback) {
    const { message = "" } = objRule;
    const value = !!strValue ? strValue.trim() : strValue;
    if (!value) {
      callback(message);
    }
    callback();
  },
  //验证登录密码，必须含有大写，小写和数字
  checkLoginPassword(strPassword) {
    const regExp = /^(?=[0-9a-zA-Z]*[a-z])(?=[0-9a-zA-Z]*[A-Z])(?=[0-9a-zA-Z]*\d)[0-9a-zA-Z]{8,16}$/;
    return regExp.test(strPassword);
  },
  //验证是否包含中文和空格
  checkChineseBlank(strPassword) {
    const regExp = /[。【】〖〗……·×“”〃‘’、——》《〔〕\s\u4e00-\u9fa5\uFF00-\uFFFF]+/;
    return regExp.test(strPassword);
  },
  //验证最大金额输入，10亿
  checkMaxPrincial(strPrin) {
    return strPrin * 1 <= 1000000000;
  },
  //验证最大金额
  validateMaxPrincial(objRule, strValue, callback) {
    const { message = "" } = objRule;
    const value = strValue * 1 <= 1000000000;
    if (!value) {
      callback(message);
    }
    callback();
  },
  //验证数组必填
  validateArray(objRule, arrValue, callback) {
    const { message = "" } = objRule;
    if (!arrValue || !arrValue.length) {
      callback(message);
    }
    callback();
  },
  //验证数组
  checkArrayLen(arrList) {
    return !arrList || !arrList.length;
  }
};
