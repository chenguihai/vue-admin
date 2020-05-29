import request from '@/utils/request'

export function listRequest(type, data) { // 上刊图片 / 视频 - 列表
  return request({
    url: '/journal/' + type,
    method: 'get',
    params: data
  })
}

export function addRequest(param) { // 上刊图片 / 视频  - 新增
  return request({
    url: '/journal',
    method: 'post',
    timeout: 400000,
    data: param
  })
}

export function checkRequest(param) { // 上刊图片 / 视频  - 上下架
  return request({
    url: '/journalBatch',
    method: 'post',
    data: param
  })
}

export function editRequest(id, param) { // 上刊图片 / 视频  - 编辑
  return request({
    url: '/journal/' + id,
    method: 'patch',
    timeout: 400000,
    data: param
  })
}

export function delRequest(id) { // 上刊图片 / 视频  - 删除
  return request({
    url: '/journal/' + id,
    method: 'delete'
  })
}
export function journalApplyRequest(id) { // 实时上刊 - 提交审核
  return request({
    url: '/journalApply/' + id,
    method: 'get'
  })
}
export function journalInfo(id) { // 实时上刊 - 详情
  return request({
    url: '/journalInfo/' + id,
    method: 'get'
  })
}

export function serviceRealm() { //
  return request({
    url: '/getServiceRealm',
    method: 'get'
  })
}

export function mediaType() { // 上刊媒体类型 - 列表
  return request({
    url: '/getMediaType',
    method: 'get'
  })
}
