/**
 * 随机生成颜色值
 */
export function getRandomColor(): string {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const color = "rgba(" + red + ", " + green + ", " + blue + ", 1)";
  return color;
}

/**
 * 颜色透明
 */
export function colorOpacity(color: string, opacity: number) {
  return color.replace(", 1)", `, ${opacity})`);
}

/**
 * 判定一个数组是否是另外一个数组的子集
 */
export function isSubset(subset: Array<string>, superset: Array<string>) {
  const supersetSet = new Set(superset);
  return subset.every((element) => supersetSet.has(element));
}

/**
 * 取多数据交集
 */
export function arrayIntersection(...arrays: Array<any>) {
  return arrays.reduce((previousArray: Array<string>, currentArray) =>
    previousArray.filter((element) => currentArray.includes(element))
  );
}

/**
 * json字符串parse
 */
export function jsonStrParse(str: string) {
  let res;
  try {
    res = JSON.parse(str);
  } catch (error) {
    console.warn("JSON parse error!");
    res = {};
  }
  return res;
}

/** 时区 */
function getTimeShiqu(value: any, data: number) {
  const time = new Date(value); //获取时间
  // 获取时间偏移量 getTimezoneOffset 获取格林威治时间   *60000是到毫秒
  const dataOffset = new Date(value).getTimezoneOffset() * 60000;
  // 获取格林威治时间
  const utc = time.getTime() + dataOffset; // 两个时间戳
  // 拿格林威治时间去反推指定地区时间
  const newTime = utc + 3600000 * data; //
  const times = new Date(newTime);
  return times;
}

//时间转换
export function format(value: any, type: string = "yyyy-MM-dd hh:mm:ss") {
  if (!value) {
    return "";
  }
  const D = getTimeShiqu(value, 8);
  const y = D.getFullYear();
  const M = D.getMonth() + 1 < 10 ? `0${D.getMonth() + 1}` : D.getMonth() + 1;
  const d = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate();
  const h = D.getHours() < 10 ? `0${D.getHours()}` : D.getHours();
  const m = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes();
  const s = D.getSeconds() < 10 ? `0${D.getSeconds()}` : D.getSeconds();
  if (type == "MM-dd") {
    return `${M}-${d}`;
  } else if (type == "MM-dd hh:mm") {
    return `${M}-${d} ${h}:${m}`;
  } else if (type == "MM月dd日") {
    return `${M}月${d}日`;
  } else if (type == "MM/dd/hh") {
    return `${M}/${d} ${h}:${m}`;
  } else if (type == "hh:mm") {
    return `${h}:${m}`;
  } else if (type == "hh:mm:ss") {
    return ` ${h}:${m}:${s}`;
  } else if (type == "h") {
    return `${h}`;
  } else if (type == "hh") {
    return `${h}:00`;
  } else if (type == "yyyy-MM-dd") {
    return `${y}-${M}-${d}`;
  } else if (type == "yyyy-MM-dd hh:mm") {
    return `${y}-${M}-${d} ${h}:${m}`;
  } else if (type == "yyyy-MM-dd hh:mm:ss") {
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
  } else if (type == "yyyy/MM/dd") {
    return `${y}/${M}/${d}`;
  } else if (type == "YYYY年MM月DD日 HH:mm:ss") {
    return `${y}年${M}月${d}日 ${h}:${m}:${s}`;
  }
}

/**
 * 隐藏字符串中间，展示后4
 * @param str
 * @returns
 */
export function hiddenText1(str: string) {
  if (str.length <= 8) {
    return str; // 如果字符串长度小于等于8，则返回原字符串
  }
  const firstFour = str.slice(0, 4); // 获取前四位
  const lastFour = str.slice(-4); // 获取后四位
  const hideChars = "*".repeat(str.length - 8); // 生成隐藏字符 "*"
  return `${firstFour}${hideChars}${lastFour}`; // 组合字符串
}

/**
 * 隐藏字符串中间，展示前4后3
 * @param str
 * @returns
 */
export function hiddenText(str: string) {
  if (str && str.length > 7) {
    return str.substring(0, 4) + "****" + str.substring(str.length - 3);
  }
  return str;
}

/**
 * 数量文本展示
 * @param text
 * @returns
 */

export const getNumberText = (count: any) => {
  if (count && typeof count === "number") {
    if (count >= 10000) {
      const num = (count / 10000).toFixed(1);
      return `${num}w`;
    } else {
      return count.toLocaleString(); //将数字转换为带有千位分隔符的字符串
    }
  } else {
    return 0;
  }
};

/**
 * 将总秒数转换成 分：秒
 * @param m - 分
 */
export function transformToTimeCountDown(m: number) {
  const seconds = m * 60;
  const SECONDS_A_MINUTE = 60;
  function fillZero(num: number) {
    return num.toString().padStart(2, "0"); // 往前填充0至两位
  }
  const minuteNum = Math.floor(seconds / SECONDS_A_MINUTE); // 向下取整
  const minute = fillZero(minuteNum);
  const second = fillZero(seconds - minuteNum * SECONDS_A_MINUTE);
  return `${minute}:${second}`;
}

/**
 * 获取当前href中的参数
 * @returns object
 */
export const getParamsFromUrl = () => {
  // 获取当前 URL 的 hash 部分（# 后面的部分）
  const hash = decodeURIComponent(window.location.hash);
  // 取出 ? 后面的查询参数部分
  const queryString = hash.split("?")[1]; // 获取 hash 中 ? 后面的部分
  // 如果查询参数部分存在，则使用 URLSearchParams 解析参数
  if (queryString) {
    const params = new URLSearchParams(queryString);
    const paramsObj = {};
    // 遍历所有查询参数并将其转为对象形式
    for (const [key, value] of params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  }
  return {};
};

/**
 * 随机生成一个以${str}_拼接当前时间戳的字符串
 * @param {string} str
 * 租户编码,机构编码（前端生成）
 */
export function randomString(str: string) {
  return `${str}_${new Date().getTime()}`;
}

/* -------------------ghhu--------------------------- */

/**
  loadJS(['test1.js', 'test2.js'], () => {
    // 用户的回调逻辑
  })
 * @param files  需要加载的js文件数组
 * @param done
 */
export function loadJS(files, done) {
  // 获取head标签
  const head = document.getElementsByTagName("head")[0];
  Promise.all(
    files.map((file) => {
      return new Promise<void>((resolve) => {
        // 创建script标签并添加到head
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = file;
        // 监听load事件，如果加载完成则resolve
        s.addEventListener("load", (e) => resolve(), false);
        head.appendChild(s);
      });
    })
  ).then(done);
  // 所有均完成，执行用户的回调事件
}

/**
 * const arr = [
  { classId: '1', name: '张三', age: 16 },
  { classId: '1', name: '李四', age: 15 },
  { classId: '2', name: '王五', age: 16 },
  { classId: '3', name: '赵六', age: 15 },
  { classId: '2', name: '孔七', age: 16 }
]
groupArrayByKey(arr, 'classId')
 * @param arr
 * @param key
 * @returns
 */
export function groupArrayByKey<T extends Record<string, any>>(
  arr: T[] = [],
  key: keyof T
) {
  return arr.reduce(
    (t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t),
    {} as Record<string, T[]>
  );
}

/**
 * 函数只执行一次
 * @param fn
 * @returns
 */
export function once(fn) {
  // 利用闭包判断函数是否执行过
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

/**
 * 这是一个获取容器缩放样式的函数。根据输入的容器元素和设计草稿的宽高，计算出容器的缩放比例，并返回一个包含该缩放比例的对象。
 * 记得用时需要window.addEventListener('resize', fun)监听窗口变化事件，动态更新缩放比例。
 *
 * @param {HTMLElement} container - 需要计算缩放比例的容器元素。
 * @param {Number} designDraftWidth - 设计草稿的宽度，默认值为1920。
 * @param {Number} designDraftHeight - 设计草稿的高度，默认值为1080。
 * @return {Object} 返回一个对象，该对象包含一个transform属性，其值是一个字符串，表示容器元素的缩放比例。
 */
export const getContainerScaleStyle = (
  container: HTMLElement,
  designDraftWidth: number = 1920,
  designDraftHeight: number = 1080
) => {
  const clientWidth = container.clientWidth;
  const clientHeight = container.clientHeight;
  const scale =
    clientWidth / clientHeight < designDraftWidth / designDraftHeight
      ? clientWidth / designDraftWidth
      : clientHeight / designDraftHeight;
  //缩放比例
  let containerStyleObj = {
    transform: `scale(${scale})`,
  };
  return containerStyleObj;
};
