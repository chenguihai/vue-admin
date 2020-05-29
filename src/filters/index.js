import { aliyunUrl, addressCommon } from '@/utils/common'
// import parseTime, formatTime and set to filter
export { parseTime, formatTime }
  from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function invoiceType(type) { // 1: "普通发票", 2: "增值税专用"
  let name = ''
  switch (type) {
    case 1:
      name = '普通发票'
      break
    case 2:
      name = '增值税专用发票'
      break
  }
  return name
}

export function orderRefundType(type) { // 1: "购买服务", 2: ""
  let name = ''
  switch (type) {
    case 1:
      name = '购买服务'
      break
    default:
      name = ''
      break
  }
  return name
}

export function evaluate(type) { // 1是好评 2是中评 3是差评
  let name = ''
  switch (type) {
    case 1:
      name = '好评'
      break
    case 2:
      name = '中评'
      break
    default:
      name = '差评'
      break
  }
  return name
}

export function clueStatusF(type) { // 线索状态 N:已关闭,Y:未关闭' 1 已成交
  let name = ''
  switch (type) {
    case 'N':
      name = '已关闭'
      break
    case 'Y':
      name = '未关闭'
      break
    case 1:
      name = '已成交'
      break
  }
  return name
}

export function payStatusF(type) { // pay_status 状态 :0 未付款，1 已付款，2 已退款',
  let name = ''
  switch (type) {
    case 0:
      name = '未付款'
      break
    case 1:
      name = '已付款'
      break
    case 2:
      name = '已退款'
      break
  }
  return name
}

export function settleTypeF(type) { // 结算类型：1 服务 2 任务 3 案例 4 传记 5 上刊画面
  let name = ''
  switch (type) {
    case 1:
      name = '服务订单'
      break
    case 2:
      name = '任务订单'
      break
    case 3:
      name = '案例订单'
      break
    case 4:
      name = '传记订单'
      break
    case 5:
      name = '上刊画面订单'
      break
  }
  return name
}

export function orderStateFilter(num) { // 订单状态的filter
  let name = ''
  switch (num) {
    case 0:
    case 1:
      name = '待托管'
      break
    case 2:
      name = '待接单'
      break
    case 3:
      name = '待签署'
      break
    case 4:
      name = '工作中'
      break
    case 5:
      name = '待验收'
      break
    case 6:
      name = '待评价'
      break
    case 7:
      name = '已成交'
      break
    case 8:
      name = '已冻结'
      break
    case 9:
      name = '未成交'
      break
  }
  return name
}

export function reportState(type) { // 处理状态：0待审核，1 举报通过，2 举报失败
  let name = ''
  switch (type) {
    case 0:
      name = '待审核'
      break
    case 1:
      name = '举报通过'
      break
    case 2:
      name = '举报失败'
      break
  }
  return name
}

export function examineStateF(type) { // 审核状态：0 待审核，1 已通过，2 未通过
  let name = ''
  switch (type) {
    case 0:
      name = '待审核'
      break
    case 1:
      name = '已通过'
      break
    case 2:
      name = '未通过'
      break
  }
  return name
}

export function orderStateF(type) { // 订单状态：1 待支付 2 已成交，3 未成交
  let name = ''
  switch (type) {
    case 1:
      name = '待支付'
      break
    case 2:
      name = '已成交'
      break
    case 3:
      name = '未成交'
      break
  }
  return name
}

export function mediaStateF(type) { // 订单状态：0 待支付 1 已成交，2 未成交
  let name = ''
  switch (type) {
    case 0:
      name = '待支付'
      break
    case 1:
      name = '已成交'
      break
    case 2:
      name = '未成交'
      break
  }
  return name
}

export function mediaTypeF(type) { // 类型： 1 图片，2 视频
  let name = ''
  switch (type) {
    case 1:
      name = '图片'
      break
    case 2:
      name = '视频'
      break
  }
  return name
}

export function tradeTypeF(type) { // 结算类型：13 代付款转出 14 订单结算存入 15 订单佣金转出
  let name = ''
  switch (type) {
    case 13:
      name = '代付款转出'
      break
    case 14:
      name = '订单结算存入'
      break
    case 15:
      name = '订单佣金转出'
      break
  }
  return name
}

export function tagType(type) { // tag 类型 ：0 info  1 success -1 danger
  let name = 'info'
  switch (type) {
    case 0:
    case 'N':
      name = 'info'
      break
    case 1:
    case 'S':
      name = 'success'
      break
    case -1:
    case 2:
    case 'Y':
      name = 'danger'
      break
  }
  return name
}

export function formatTimeStamp(time) {
  if (time === '0') {
    return ''
  }
  const now = new Date(time * 1000)
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

export function completePicture(url) { // 拼接图片前缀
  return url ? aliyunUrl + url + '?x-oss-process=image/resize,m_fill,h_60,w_100' : ''
}
export function brandPicture(url) { // 拼接图片前缀
  return url ? aliyunUrl + url + '?x-oss-process=image/resize,m_fill,h_51,w_115' : ''
}

export function prefixPicture(url) { // 拼接图片前缀
  return url ? aliyunUrl + url : ''
}

export function avatarFilter(url) { // 拼接图片前缀
  let newUrl = ''
  if (url.includes('http')) {
    newUrl = url
  } else {
    newUrl = aliyunUrl + url
  }
  return newUrl
}

export function originUrlF(url) { // 拼接前缀跳转到商品商城
  const { protocol, hostname } = location
  return protocol + '//' + hostname + '/contract/contranct-index?cert=88888&order_sn=' + url
}

export function evaluateUrlF(url) { // 拼接前缀跳转到评论
  const { protocol, hostname } = location
  return protocol + '//' + hostname + '/contract/contranct-index?order_sn=' + url
}

export function exampleUrlF(id) { // 拼接前缀跳转到客户合作示例
  let shopInfo = {}
  const info = localStorage.getItem('shopInfo')
  if (info) {
    shopInfo = JSON.parse(info)
  }
  const { protocol, hostname } = location
  return protocol + '//' + hostname + `/shopwork/${id}?shopid=${shopInfo.id}`
}

export function clueUrlF(id) { // 拼接前缀跳转到线索详情
  const { protocol, hostname } = location
  return protocol + '//' + hostname + `/clues/${id}`
}

export function contranctUrlF(id) { // 拼接前缀跳转到商城服务工作台
  const { protocol, hostname } = location
  return protocol + '//' + hostname + `/contract/contranct-index?order_sn=${id}`
}

export function shopIndexUrlF(id) { // 拼接前缀跳转到店铺首页
  const { protocol, hostname } = location
  return protocol + '//' + hostname + `/shop/${id}`
}

// http://localhost:3000/contract/contranct-index?order_sn=1202002295650494355
export function prefixUrlF(url) { // 拼接前缀跳转到商品商城
  const { protocol, hostname } = location
  return protocol + '//' + hostname + url
}

export function addressCommonF(val) {
  return addressCommon(val)
}
