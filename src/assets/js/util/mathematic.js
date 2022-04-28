export function clamp(x, min, max) {
  if (x > max) {
    x = max
  }
  if (x < min) {
    x = min
  }
  return x
}

export function fillDigit(x, len) {
  let sx = String(x)
  while (sx.length < len)
    sx = "0" + sx
  return sx
}

function parseTime(n) {
  let rest = n
  let o = {}
  const segs = [['d', 24 * 3600000], ['h', 3600000], ['m', 60000], ['s', 1000]]
  segs.forEach(item => {
    o[item[0]] = Math.floor(rest / Number(item[1]))
    rest -= o[item[0]] * Number(item[1])
  })
  return o
}

function formatTime(n) {
  const date = parseTime(n)
  return (date.h > 0 ? date.h + ':' : '') + fillDigit(date.m, 2) + ':' + fillDigit(date.s, 2)
}

function randomHexColor() {
  let color = '#'
  for (let ci = 0; ci < 3; ci++) {
    color += fillDigit(Math.round(Math.random() * 255).toString(16), 2)
  }
  return color
}

function dist(oa, ob) {
  return Math.sqrt(Math.abs(Math.pow(oa.x - ob.x, 2) + Math.pow(oa.y - ob.y, 2)))
}

function angle(p1, p2) {
  var dx = p2.x - p1.x
  var dy = p1.y - p2.y
  var angle = Math.atan2(dy, dx)
  return angle * (180 / Math.PI)
}

function percent(x, a, b) {
  return (x-a)/(b-a)
}