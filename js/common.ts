import { resetMessage } from './resetMessage'
import { JSEncrypt } from 'jsencrypt'

interface I_MessageConfig {
  name?: string
  desc?: string
  flag?: string
  title?: string
  placeholder?: string
  inputValidator?: Function
}

const baseUrl = '/flames-agent-manager/flames/api/v1'

function getFile(path: string) {
  return (
    `${(window as any).SYSTEM_CONFIG_BASEURL || ''}/proxyApi` +
    baseUrl +
    `/storage/getSimple/${path}`
  )
}

/**
 * HTML转义 避免XSS攻击
 * @param {string} unsafe
 */
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 递归转义对象中的字符串属性
 * @param {I_MessageConfig} obj - 需要转义的对象
 * @returns {I_MessageConfig} - 转义后的对象
 */
const escapeObjectStrings = (obj: I_MessageConfig): any => {
  if (typeof obj === 'string') {
    return escapeHtml(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(item => escapeObjectStrings(item))
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, escapeObjectStrings(value)])
    )
  }
  return obj // 其他类型保持不变
}

/**
 * 删除弹框
 * @param {I_MessageConfig} config
 */
export const delMessageBox = (config: I_MessageConfig) => {
  return new Promise((resolve, reject) => {
    const safeConfig = escapeObjectStrings(config)
    // @ts-ignore
    const ElMessageBox = window.ElMessageBox
    ElMessageBox.confirm(
      `<h1>您确认要删除${safeConfig?.name}吗？</h1>
       <p>${safeConfig?.desc ? safeConfig?.desc : '删除后将无法还原，请谨慎操作'}</p>`,
      `${safeConfig?.title ? safeConfig.title : '删除提示'}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--primary',
        customClass: 'work-assistant-del-message-box',
        showClose: true,
        closeOnClickModal: false,
        type: 'warning'
      }
    )
      .then(() => resolve(''))
      .catch(() => reject(''))
  })
}

/**
 * 提示框
 * @param {I_MessageConfig} config
 */
export const tipMessageBox = (config: I_MessageConfig) => {
  return new Promise((resolve, reject) => {
    const safeConfig = escapeObjectStrings(config)
    // @ts-ignore
    const ElMessageBox = window.ElMessageBox
    ElMessageBox.confirm(
      `<h1>${safeConfig?.name}</h1>
      <p>${safeConfig?.desc ? safeConfig?.desc : ''}</p>
      `,
      `${safeConfig?.title ? safeConfig.title : '确认提示'}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'work-assistant-tip-message-box',
        showClose: true,
        closeOnClickModal: false,
        type: 'warning'
      }
    )
      .then(() => resolve(''))
      .catch(() => reject(''))
  })
}

/**
 * 需二次输入内容
 * @param {I_MessageConfig} config
 */
export const promptMessageBox = (config: I_MessageConfig) => {
  return new Promise((resolve, reject) => {
    const safeConfig = escapeObjectStrings(config)
    // @ts-ignore
    const ElMessageBox = window.ElMessageBox
    ElMessageBox.prompt(
      `<h1>${safeConfig?.name}</h1>
      <p>${safeConfig?.desc ? safeConfig?.desc : ''}</p>
        `,
      `${safeConfig?.flag == 'del' ? '删除提示' : '确认提示'}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'work-assistant-del-message-box',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning',
        inputValidator: safeConfig?.inputValidator,
        inputPlaceholder: safeConfig?.placeholder
      }
    )
      .then(({ value }) => resolve(value))
      .catch(() => reject())
  })
}

/**
 * 生成uuid唯一标识符
 * @returns uuid
 */
export function generateUUID() {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

/**
 * 下载文件
 * @param url
 * @param fileName
 */
export function downloadFun(url: string, fileName: string = 'template.csv') {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function downLoadBlobFile(data: any, fileName: string, ext = 'xlsx', showSuffix = true) {
  let blob = new Blob([data])
  let aEl = document.createElement('a')

  let href = window.URL.createObjectURL(blob)
  aEl.href = href

  if (showSuffix) {
    aEl.download = `${fileName}.${ext}`
  } else {
    aEl.download = `${fileName}`
  }
  aEl.style.display = 'none'
  document.body.appendChild(aEl)

  aEl.click()

  document.body.removeChild(aEl)
  window.URL.revokeObjectURL(href)
}

/**
 * 滚动到元素最底端
 * @param selector
 */
export const scrollToBottom = (selector: string) => {
  const $el = document.querySelector(selector)
  if ($el && $el.scrollHeight > 100) {
    $el.scrollTop = $el.scrollHeight
  }
}

/**
 * 递归深拷贝
 * @param obj
 * @returns
 */
export function deepCopy(obj: any) {
  const objArray: any = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        objArray[key] = deepCopy(obj[key])
      } else {
        objArray[key] = obj[key]
      }
    }
  }
  return objArray
}

// ip地址校验
export const ipAddrRule = [
  { required: true, message: '请输入IP地址', trigger: ['change', 'blur'] },
  {
    validator: function (rule: any, value: any, callback: any) {
      if (
        value &&
        /^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/.test(
          value
        ) == false
      ) {
        callback(new Error('IP地址格式错误'))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  }
]

//获取文件后缀
export function getFileSuffix(value: string): string {
  const specialList = ['.tar.gz'] //特殊文件后缀集合
  //查找文件后缀是否为特殊后缀
  let special_suffix = ''
  specialList.forEach((str: string) => {
    const Index = value.indexOf(str)
    if (Index > -1 && Index + str.length === value.length) {
      special_suffix = str
    }
  })
  //正常文件后缀
  const arr = value.split('.')
  const last = arr[arr.length - 1]
  let suffix = ''
  if (special_suffix) {
    suffix = special_suffix
  } else {
    suffix = `${last}`
  }
  return suffix.toLocaleLowerCase()
}

// 将文件转换为base64
export function fileToBase64Async(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e: any) => {
      const arr = e.target.result && e.target.result.split(',')
      const base64 = arr[1]
      resolve(base64)
    }
  })
}

/** 图片地址转base64 */
export async function imageUrlToBase64(url: string) {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = (error: any) => reject(error)
    reader.readAsDataURL(blob)
  })
}

/** 复制文本 */
export function copyText(beCopyText: string, tip = '复制成功') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(beCopyText).then(() => {
      resetMessage({
        type: 'success',
        message: tip
      })
    })
  } else {
    // 创建一个临时的 textarea 元素
    const textarea = document.createElement('textarea')
    textarea.value = beCopyText
    // 将 textarea 添加到文档中
    document.body.appendChild(textarea)
    // 选择并复制文本
    textarea.select()
    document.execCommand('copy')
    resetMessage({
      type: 'success',
      message: tip
    })
    // 移除临时元素
    document.body.removeChild(textarea)
  }
}

/** 获取粘贴板数据 */
export async function pasteText() {
  if (!navigator.clipboard) {
    resetMessage({ type: 'warning', message: '当前网址的粘贴板权限已禁用！' })
    return ''
  } else {
    try {
      return await navigator.clipboard.readText()
    } catch (err) {
      console.error('Failed to paste: ', err)
      /** 火狐浏览器在125以下不支持读取粘贴板数据，navigator.clipboard无readText函数，异常 */
      navigator.userAgent.includes('Firefox') &&
        resetMessage({
          type: 'warning',
          message: '因浏览器安全策略限制，当前浏览器不支持快捷粘贴！'
        })
      return ''
    }
  }
}

const imgAccept = '.png,.jpg,.jpeg,.svg,.tif,.tiff,.bmp,.jfif'

/** 打开文件选择器弹框 */
export function openFileDialog(
  callback: Function,
  accept: string = imgAccept,
  multiple: boolean = false
) {
  const inpEle = document.createElement('input')
  inpEle.id = `__file_${Math.trunc(Math.random() * 100000)}`
  inpEle.type = 'file'
  inpEle.style.display = 'none'
  // 文件类型限制
  accept && (inpEle.accept = accept)
  // 多选限制
  multiple && (inpEle.multiple = multiple)
  inpEle.addEventListener('change', event => callback.call(inpEle, event, inpEle.files), {
    once: true
  })
  inpEle.click()
}

export function convertImageToBase64(imgUrl: string) {
  return new Promise(function (resolve, reject) {
    if (!imgUrl) {
      resolve('')
      return
    }
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
      canvas.height = image.naturalHeight
      canvas.width = image.naturalWidth
      ctx?.drawImage(image, 0, 0)
      const dataUrl = canvas.toDataURL()
      resolve(dataUrl)
    }
    image.src = getFile(imgUrl)
  })
}

/**
 * 判断是否为空
 * 判断包含 null、undefined、空字符串""、空数组[]、空对象{}
 */
export function isEmpty(value: any) {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
}
export const getObjectURL = (file: File) => {
  const binaryData = [] as any
  binaryData.push(file)
  let url: any = null
  if ((window as any).createObjectURL !== undefined) {
    // basic
    url = (window as any).createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    try {
      url = window.webkitURL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
    } catch (error) {}
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    try {
      url = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
    } catch (error) {}
  }
  return url
}
export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export function getLastDays(day: number) {
  let dates: any[] = []
  for (let i = day; i >= 0; i--) {
    let date: any = new Date()
    date.setDate(date.getDate() - i)
    dates.unshift(date.toISOString().split('T')[0])
  }
  return dates
}

/** 处理时间，在时间后面加上单位 */
export function timeAddUnit(time: number): string {
  if (Object.prototype.toString.call(time) !== '[object Number]' || isNaN(time)) return ''
  if (time < 1000) return time + 'ms'
  return (time / 1000).toFixed(1) + 's'
}

/**
 * RSA加密
 * @param str 要加密的字符串
 * @param publicKey 公钥
 * @returns 加密之后的结果
 */
export function getEncrypt(str: string, publicKey: string): string {
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(str) as string
}

/** 文件大小的转换工具函数 */
export function formatFileSize(bytes: number) {
  if (bytes <= 0) return '0 Bytes'
  const k = 1024
  const dm: any = decimalAdjust(Math.round(bytes / k))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(dm) / Math.log(k))
  return parseFloat((dm / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function decimalAdjust(value: number, exp = 0) {
  const c = 10 ** exp
  return String(Math.round(c * value) / c)
}

/** 获取电脑操作系统 */
export function getSystemType(): string {
  var userAgent = navigator.userAgent
  if (userAgent.indexOf('Mac') != -1) {
    return 'mac'
  } else if (userAgent.indexOf('Win') != -1) {
    return 'win'
  }
  return 'other'
}

//判断一串数字是否是连续的
export const isContinuityNum = (num: number[]) => {
  let array = [...num]

  let i = array[0]
  let isContinuation = true
  for (let e in array) {
    if (array[e] != i) {
      isContinuation = false
      break
    }
    i++
  }
  return isContinuation
}
