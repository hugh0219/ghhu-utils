/**
 * 随机生成颜色值
 */
export function getRandomColor(): string {
  const red = Math.floor(Math.random() * 256)
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)
  const color = 'rgba(' + red + ', ' + green + ', ' + blue + ', 1)'
  return color
}

/**
 * 颜色透明
 */
export function colorOpacity(color: string, opacity: number) {
  return color.replace(', 1)', `, ${opacity})`)
}

/**
 * 判定一个数组是否是另外一个数组的子集
 */
export function isSubset(subset: Array<string>, superset: Array<string>) {
  const supersetSet = new Set(superset)
  return subset.every(element => supersetSet.has(element))
}

/**
 * 取多数据交集
 */
export function arrayIntersection(...arrays: Array<any>) {
  return arrays.reduce((previousArray: Array<string>, currentArray) =>
    previousArray.filter(element => currentArray.includes(element))
  )
}

/**
 * json字符串parse
 */
export function jsonStrParse(str: string) {
  let res
  try {
    res = JSON.parse(str)
  } catch (error) {
    console.warn('JSON parse error!')
    res = {}
  }
  return res
}

/** 时区 */
function getTimeShiqu(value: any, data: number) {
  const time = new Date(value) //获取时间
  // 获取时间偏移量 getTimezoneOffset 获取格林威治时间   *60000是到毫秒
  const dataOffset = new Date(value).getTimezoneOffset() * 60000
  // 获取格林威治时间
  const utc = time.getTime() + dataOffset // 两个时间戳
  // 拿格林威治时间去反推指定地区时间
  const newTime = utc + 3600000 * data //
  const times = new Date(newTime)
  return times
}

//时间转换
export function format(value: any, type: string = 'yyyy-MM-dd hh:mm:ss') {
  if (!value) {
    return ''
  }
  const D = getTimeShiqu(value, 8)
  const y = D.getFullYear()
  const M = D.getMonth() + 1 < 10 ? `0${D.getMonth() + 1}` : D.getMonth() + 1
  const d = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate()
  const h = D.getHours() < 10 ? `0${D.getHours()}` : D.getHours()
  const m = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes()
  const s = D.getSeconds() < 10 ? `0${D.getSeconds()}` : D.getSeconds()
  if (type == 'MM-dd') {
    return `${M}-${d}`
  } else if (type == 'MM-dd hh:mm') {
    return `${M}-${d} ${h}:${m}`
  } else if (type == 'MM月dd日') {
    return `${M}月${d}日`
  } else if (type == 'MM/dd/hh') {
    return `${M}/${d} ${h}:${m}`
  } else if (type == 'hh:mm') {
    return `${h}:${m}`
  } else if (type == 'hh:mm:ss') {
    return ` ${h}:${m}:${s}`
  } else if (type == 'h') {
    return `${h}`
  } else if (type == 'hh') {
    return `${h}:00`
  } else if (type == 'yyyy-MM-dd') {
    return `${y}-${M}-${d}`
  } else if (type == 'yyyy-MM-dd hh:mm') {
    return `${y}-${M}-${d} ${h}:${m}`
  } else if (type == 'yyyy-MM-dd hh:mm:ss') {
    return `${y}-${M}-${d} ${h}:${m}:${s}`
  } else if (type == 'yyyy/MM/dd') {
    return `${y}/${M}/${d}`
  } else if (type == 'YYYY年MM月DD日 HH:mm:ss') {
    return `${y}年${M}月${d}日 ${h}:${m}:${s}`
  }
}

/**
 * 隐藏字符串中间，展示后4
 * @param str
 * @returns
 */
export function hiddenText1(str: string) {
  if (str.length <= 8) {
    return str // 如果字符串长度小于等于8，则返回原字符串
  }
  const firstFour = str.slice(0, 4) // 获取前四位
  const lastFour = str.slice(-4) // 获取后四位
  const hideChars = '*'.repeat(str.length - 8) // 生成隐藏字符 "*"
  return `${firstFour}${hideChars}${lastFour}` // 组合字符串
}

/**
 * 隐藏字符串中间，展示前4后3
 * @param str
 * @returns
 */
export function hiddenText(str: string) {
  if (str && str.length > 7) {
    return str.substring(0, 4) + '****' + str.substring(str.length - 3)
  }
  return str
}

/**
 * 数量文本展示
 * @param text
 * @returns
 */

export const getNumberText = (count: any) => {
  if (count && typeof count === 'number') {
    if (count >= 10000) {
      const num = (count / 10000).toFixed(1)
      return `${num}w`
    } else {
      return count.toLocaleString() //将数字转换为带有千位分隔符的字符串
    }
  } else {
    return 0
  }
}

/**
 * 将总秒数转换成 分：秒
 * @param m - 分
 */
export function transformToTimeCountDown(m: number) {
  const seconds = m * 60
  const SECONDS_A_MINUTE = 60
  function fillZero(num: number) {
    return num.toString().padStart(2, '0') // 往前填充0至两位
  }
  const minuteNum = Math.floor(seconds / SECONDS_A_MINUTE) // 向下取整
  const minute = fillZero(minuteNum)
  const second = fillZero(seconds - minuteNum * SECONDS_A_MINUTE)
  return `${minute}:${second}`
}

/**
 * 获取当前href中的参数
 * @returns object
 */
export const getParamsFromUrl = () => {
  // 获取当前 URL 的 hash 部分（# 后面的部分）
  const hash = decodeURIComponent(window.location.hash)
  // 取出 ? 后面的查询参数部分
  const queryString = hash.split('?')[1] // 获取 hash 中 ? 后面的部分
  // 如果查询参数部分存在，则使用 URLSearchParams 解析参数
  if (queryString) {
    const params = new URLSearchParams(queryString)
    const paramsObj = {}
    // 遍历所有查询参数并将其转为对象形式
    for (const [key, value] of params.entries()) {
      paramsObj[key] = value
    }
    return paramsObj
  }
  return {}
}

/**
 * 随机生成一个以${str}_拼接当前时间戳的字符串
 * @param {string} str
 * 租户编码,机构编码（前端生成）
 */
export function randomString(str: string) {
  return `${str}_${new Date().getTime()}`
}
