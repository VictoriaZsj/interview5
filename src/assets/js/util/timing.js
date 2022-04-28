function clamp(x, min, max) {
  if (x > max) {
    x = max
  }
  if (x < min) {
    x = min
  }
  return x
}

export function Limiter() {
  this.pool_tt = {}
  this.pool_db = {}
  this.queue_async = []
  this.queue_abort = []
  this.queue_result = []
  this.init()
}

Limiter.prototype.init = function () {
  var methods = ['throttle','clear','abort','interruptDb','interruptTt']
  for(var i in methods){
    this[methods[i]].bind(this)
  }
}

Limiter.prototype.throttle = async function (key, fn, interval) {
  if (this.pool_tt[key]) return false
  this.pool_tt[key] = true
  var that = this
  return new Promise(async function (res) {
    var start = new Date().getTime()
    await fn()
    var end = new Date().getTime()
    var int = clamp(interval - (end - start), 0, interval)
    if (int <= 0) {
      delete that.pool_tt[key]
      res(true)
      return
    }
    var tot = setTimeout(function () {
      clearTimeout(that[key])
      delete that.pool_tt[key]
      res(true)
    }, int)
    that.pool_tt[key] = tot
  })
}

Limiter.prototype.debounce = async function (key, fn, delay) {
  if (this.pool_db[key]) clearTimeout(this.pool_db[key])
  var tot = setTimeout(async function () {
    await fn()
    clearTimeout(tot)
  }, delay)
  this.pool_db[key] = tot
}

Limiter.prototype.interruptDb = function (k) {
  clearTimeout(this.pool_db[k])
  delete(this.pool_db[k])
}

Limiter.prototype.interruptTt = function (k) {
  clearTimeout(this.pool_tt[k])
  delete(this.pool_tt[k])
}

Limiter.prototype.clear = function () {
  var pools = ['pool_tt', 'pool_db']
  for (var k in pools) {
    for (var kk in this[pools[k]]) {
        clearTimeout(this[pools[k]][kk])
      delete(this[pools[k]][kk])
    }
  }
  this.abort()
  this.queue_result = []
}

Limiter.prototype.abort = function () {
  console.log(this.queue_async,this.queue_abort)
  for (var i in this.queue_abort) {
    this.queue_abort[i]("aborted")
  }
  this.queue_abort = []
  this.queue_async = []
}

Limiter.prototype.queue = function (fn,cb,name="thread") {
  var that = this
  function end(e) {
    that.queue_async.splice(0, 1)
    that.queue_abort.splice(0, 1)
    if(that.queue_async.length<=0)if(cb)cb(e)
    that.queue_result.push(e)
  }
  var pr = new Promise(function (res, rej) {
    that.queue_abort.push(rej)
    var interval = setInterval(function () {
      if (that.queue_async.indexOf(pr) === -1) {
        rej(name);
        clearInterval(interval);
        return
      }
      if (that.queue_async.indexOf(pr) > 0) return
      if (fn instanceof Promise){
        fn.then(function(e){
          res(e)
        })
        clearInterval(interval)
        return
      }
      var result = fn()
      //console.log(result)
      if (result instanceof Promise) {
        result.then(function (e) {
          res(e)
        })
        clearInterval(interval)
      } else {
        res(result)
        clearInterval(interval)
      }
    }, 100)
  }).then(end).catch(end)
  this.queue_async.push(pr)
}

function Timeout(callback, delay) {
  this.id = undefined
  this.callback = callback
  this.delay = delay
  this.remain = delay
  this.begin = new Date()
  this.active = false
  this.init()
}

Timeout.prototype.init = function () {
  var methods = ['start', 'pause', 'setRemain']
  for (var i in methods) {
    this[methods[i]].bind(this)
  }
}

Timeout.prototype.start = function () {
  // console.log("start")
  if (this.active) return
  this.begin = new Date();
  clearTimeout(this.id);
  this.id = setTimeout(this.callback, this.remain);
  this.active = true
}

Timeout.prototype.pause = function () {
  if (!this.active) return
  // console.log("paused")
  clearTimeout(this.id)
  this.remain -= new Date().getTime() - this.begin.getTime()
  // console.log("remaining:", this.remain)
  this.active = false
}

Timeout.prototype.setRemain = function (remain) {
  this.remain = remain
  if (this.active) {
    this.active = false
    clearTimeout(this.id)
    this.start()
  }
}

function Repeater(){
  this.pool = {}
  this.add = this.add.bind(this)
  this.interrupt = this.interrupt.bind(this)
}

Repeater.prototype.add = function(k,fn,condition,interval){
  if(this.pool[k])clearTimeout(this.pool[k])
  const that = this
  const int = setTimeout(async function(){
    const res = await fn()
    if(!condition(res)){
      that.add(k,fn,condition,interval)
      return
    }
    clearTimeout(int)
    delete that.pool[k]
  },interval)
  this.pool[k] = int
}
Repeater.prototype.interrupt = function(k){
  clearTimeout(this.pool[k])
  delete this.pool[k]
}