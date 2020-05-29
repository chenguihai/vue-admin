import request from '@/utils/request'

export function listReq(type, data) { // 案例 / 传记 - 列表
  return request({
    url: `/caseBiog/${type}`,
    method: 'get',
    params: data
  })
}

export function addReq(data) { // 案例 / 传记 - 新增
  return request({
    url: `/caseBiog`,
    method: 'post',
    data
  })
}

export function editReq(case_id, data) { // 案例 / 传记 - 编辑
  return request({
    url: `/caseBiog/${case_id}`,
    method: 'patch',
    data
  })
}

export function batchReq(data) { // 案例 / 传记 - 上下架
  return request({
    url: `/caseBiogBatch`,
    method: 'post',
    data
  })
}

export function delReq(case_id) { // 案例 / 传记 - 删除
  return request({
    url: `/caseBiog/${case_id}`,
    method: 'delete'
  })
}

export function getReq(case_id) { // 案例 / 传记 - 详情
  return request({
    url: `/caseBiogInfo/${case_id}`,
    method: 'get'
  })
}

export function mediaList(type, params) { // 案例 / 传记订单
  return request({
    url: '/caseBiogOrder/' + type,
    method: 'get',
    params
  })
}

export function journalReq(params) { // 上刊画面订单
  return request({
    url: '/journalOrder',
    method: 'get',
    params
  })
}

export function caseBiogApplyReq(id) { // 案例传记管理 - 审核
  return request({
    url: '/caseBiogApply/' + id,
    method: 'get'
  })
}
