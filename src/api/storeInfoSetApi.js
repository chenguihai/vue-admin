import request from '@/utils/request'

export function storeSetting(data) { // 店铺自定义设置
  return request({
    url: '/store/storeSetting',
    method: 'POST',
    data
  })
}
export function storeInfo() { // 店铺自定义设置
  return request({
    url: '/store/storeInfo',
    method: 'get'
  })
}
