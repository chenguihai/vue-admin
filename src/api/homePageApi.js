import request from '@/utils/request'

export function storeIndex() { // 店铺后台 - 首页
  return request({
    url: '/storeIndex',
    method: 'get'
  })
}

export function selectTime(type, ymd) { // 店铺后台 - 选择日期
  return request({
    url: `/storeIndexSearch/${type}/${ymd}`,
    method: 'get'
  })
}
