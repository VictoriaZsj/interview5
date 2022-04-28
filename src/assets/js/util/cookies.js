const cookies = {
  get(name) {
    var arr = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    );
    if (arr != null) {
      return arr[2];
    }
    return null;
  },
  set(name, value) {
    document.cookie = name + "=" + escape(value);
    return true;
  },
  setWithoutEscape(name, value) {
    document.cookie = name + "=" + value;
    return true;
  },
  remove(name) {
    var date = new Date(); //获取当前时间
    date.setTime(date.getTime() - 10000); //将date设置为过去的时间
    document.cookie = name + "=v;Path=/crm;expires =" + date.toGMTString(); //设置cookie
    return true;
  }
};

export default cookies;
