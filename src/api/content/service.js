import request from '@/utils/request'

export function listItem(sid, type, params) { // 相关媒体案例 / 传记 - 列表
  return request({
    url: `/serviceCase/${sid}/${type}`,
    method: 'get',
    params
  })
}

export function saveItem(sid, type, data) { // 相关媒体案例 / 传记 - 保存
  return request({
    url: `/serviceCaseAdd/${sid}/${type}`,
    method: 'post',
    data
  })
}
