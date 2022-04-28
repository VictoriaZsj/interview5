export const getBytes = (str) => {
  var bytesCount = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
    {
      bytesCount += 1;
    } else {
      bytesCount += 2;
    }
  }
  return bytesCount
}

export const base64ToImg = (b64) => {
  const url = b64
  const bstr = atob(url)
  let n = url.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const fi = new File([u8arr], 'temp.png')
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.onload = (res) => {
      resolve(res.target.result)
    }
    fr.readAsDataURL(fi)
  })

}

export const fillDigit = (x, len) => {
  let sx = String(x)
  while (sx.length < len) sx = '0' + sx
  return sx
}

export const parseTime = (n) => {
  let rest = n
  let o = {}
  const segs = [
    ['d', 24 * 3600000],
    ['h', 3600000],
    ['m', 60000],
    ['s', 1000]
  ]
  segs.forEach(item => {
    o[item[0]] = Math.floor(rest / Number(item[1]))
    rest -= o[item[0]] * Number(item[1])
  })
  return o
}

export const formatTime = (n) => {
  const date = parseTime(n)
  return (date.h > 0 ? date.h + ':' : '') + fillDigit(date.m, 2) + ':' + fillDigit(date.s, 2)
}

export const formatDateTime = (n, arr) => {
  const date = parseTime(n)
  let s = ''
  let first = true
  arr.forEach(item => {
    if (date[item[0][0]] <= 0 && first) {
      return
    }
    first = false
    s += fillDigit(date[item[0][0]], item[0].length) + (item[1] && item[1])
  })
  return s
}

export const timeToSecs = (s) => {
  if (!s) return 0
  const arr = s.split(":")
  let v = 0
  for (let i = arr.length - 1; i >= 0; i--) {
    v += Math.pow(60, (arr.length - 1) - i) * Number(arr[i])
  }
  // console.log("secs:" + v)
  return v
}

export const timeToMins = (s) => {
  return Math.floor(timeToSecs(s) / 60.0)
}


export const toChineseBig = (num) => {
  // 将接收到的num转换为字符串
  var strNum = String(num)
  // 定义单位
  // var unit = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟']
  var unit = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']
  // 结果中放一个符号，用来解决最后的零去不掉的问题
  var result = ['@']
  // 单位下标
  var unitNo = 0
  // 从后往前遍历接收到的数据，省略结束条件
  for (let i = strNum.length - 1;; i--) {
    // 调用转大写函数，将每一个数字转换成中文大写，一次放入一个到结果数组中
    result.unshift(numToChinese(strNum[i]))
    // 如果不大于0
    if (i <= 0) {
      // 结束循环
      break
    }
    // 放入一个数字，放入一个单位
    result.unshift(unit[unitNo])
    // 单位下标加1
    unitNo++
  }
  // 将结果数组转换成字符串，并使用正则替换一些关键位置，让结果符合语法
  // return result.join('').replace(/(零[仟佰拾]){1,3}/g, '零').replace(/零{2,}/g, '零').replace(/零([万亿])/g, '$1').replace(/亿万/g, '亿').replace(/零*@/g, '')
  return result.join('').replace(/(零[千百十]){1,3}/g, '零').replace(/零{2,}/g, '零').replace(/零([万亿])/g, '$1').replace(/亿万/g, '亿').replace(/零*@/g, '')

  function numToChinese(n) {
    // var chineseBigNum = '零壹贰叁肆伍陆柒捌玖'
    var chineseBigNum = '零一二三四五六七八九'
    return chineseBigNum[n]
  }
}
