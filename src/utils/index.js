/**
 * Created by jiachenpan on 16/11/18.
 */
import { CodeToText, TextToCode } from 'element-china-area-data'

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

export function configImgSuffix(params) {
  var arr = ['.png', '.jpg', '.jpeg']
  var str
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i]
    if (params.indexOf(ele) != -1) {
      str = ele
    }
  }
  return str
}

export function transformStrArrWithComma(str) {
  if (typeof str === 'string') {
    return str.split(',')
  } else {
    return str.join(',')
  }
}

export function transformStrArr(str) {
  if (typeof str === 'string') {
    return str.split('-')
  } else {
    return str.join('-')
  }
}

export function transformCity(str) {
  if (typeof str === 'string') {
    var arr_code = []
    var arr_text = str.split('-')
    for (let i = 0; i < arr_text.length; i++) {
      const ele = arr_text[i]
      var a = ''
      if (i === 0) {
        a = TextToCode[ele].code
      } else if (i === 1) {
        a = TextToCode[arr_text[i - 1]][ele].code
      } else {
        a = TextToCode[arr_text[i - 2]][arr_text[i - 1]][ele].code
      }
      arr_code.push(a)
    }
    return arr_code
  } else {
    var arr = []
    for (let i = 0; i < str.length; i++) {
      const ele = str[i]
      arr.push(CodeToText[ele])
    }

    if (typeof arr === 'string') {
      return arr.split('-')
    } else {
      return arr.join('-')
    }
  }
}

export function removeSpace(object) {
  var item = {}
  debounce
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key]
      if (element != '') {
        item[key] = element
      }
    }
  }
  return item
}

export function cmp(x, y) {
  // If both x and y are null or undefined and exactly the same
  if (x === y) {
    return true
  }

  // If they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false
  }

  // They must have the exact same prototype chain, the closest we can do is
  // test the constructor.
  if (x.constructor !== y.constructor) {
    return false
  }

  for (var p in x) {
    // Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined
      if (! y.hasOwnProperty(p)) {
        return false
      }

      // If they have the same strict value or identity then they are equal
      if (x[ p ] === y[ p ]) {
        continue
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal
      if (typeof (x[ p ]) !== 'object') {
        return false
      }

      // Objects and Arrays must be tested recursively
      if (! Object.equals(x[ p ], y[ p ])) {
        return false
      }
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined
    if (y.hasOwnProperty(p) && ! x.hasOwnProperty(p)) {
      return false
    }
  }
  return true
}

export function isIncludeItem(arr, item) {
  var bool = false
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i]
    if (cmp(e, item)) {
      bool = true
    }
  }
  return bool
}

export function removeArrItem(arr, item) {
  var j = 0
  var bool = false
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      j = i
      bool = true
    }
  }
  if (bool) {
    arr.splice(j, 1)
  }
  return arr
}

export function removeArrItemWithId(arr, item) {
  var j = 0
  var bool = false
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id == item.id) {
      j = i
      bool = true
    }
  }
  if (bool) {
    arr.splice(j, 1)
  }
  return arr
}

export function uniqueArr(arr) {
  var hash = []
  for (var i = 0; i < arr.length; i++) {
    if (hash.indexOf(arr[i]) == -1) {
      hash.push(arr[i])
    }
  }
  return hash
}

export function uniqueObjArr(arr) {
  var hash = []
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i]
    if (!isIncludeItem(hash, ele)) {
      hash.push(ele)
    }
  }
  return hash

  // for (var i = 0; i < arr.length; i++) {
  //   for (var j = i + 1; j < arr.length; j++) {
  //     if (arr[i] === arr[j]) {
  //       arr.splice(j, 1)
  //       j-- // 每删除一个数j的值就减1
  //       len-- // j值减小时len也要相应减1（减少循环次数，节省性能）
  //     }
  //   }
  // }
  // return arr
}
