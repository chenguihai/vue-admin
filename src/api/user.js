import request from '@/utils/request'

export function loginer(data) {
  return request({
    url: '/member/authorizations',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(id) {
  return request({
    url: '/adminLogout/' + id,
    method: 'PATCH'
  })
}
export function userInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}
export function getShopInfo() {
  return request({
    url: '/shop/getShopInfo',
    method: 'get'
  })
}
