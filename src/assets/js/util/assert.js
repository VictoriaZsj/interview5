export function assert(cond, val, fallback) {
  if (cond) return val
  return fallback
}

export function isEmpty(o) {
  if (!o) return true
  if (typeof (o) === "string" && o.trim().length <= 0) return true
  if (typeof (o) === "object" && o.filter(item => item).length <= 0) return true
  return false
}

export function isMobile() {
  const flag = /(Android|webOS|iPhone|iPod|BlackBerry|Mobile)/i.test(navigator.userAgent) // /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(UA)
  return flag;
}

export function isIE() { //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
}

export function isFireFox() {
  return /Firefox/.test(navigator.userAgent)
}

export function isSameDay(d1, d2) {
  return d1.toISOString().split("T")[0] ===
    d2.toISOString().split("T")[0]
}
