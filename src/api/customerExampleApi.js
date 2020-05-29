import request from '@/utils/request'

export function getCaseList(page) { // 客户合作示例列表
  return request({
    url: '/store/case/caseList?page=' + page,
    method: 'get'
  })
}

export function getCategory() { // 获取基础三级分类列表
  return request({
    url: '/store/getCategory',
    method: 'get'
  })
}

export function caseAdd(data) { // 新增客户合作示例
  return request({
    url: '/store/case/add',
    method: 'POST',
    data
  })
}

export function caseEditById(data, id) { // 编辑客户合作示例
  return request({
    url: '/store/case/edit/' + id,
    method: 'POST',
    data
  })
}

export function getCaseInfo(id) { // 获取客户合作示例详情
  return request({
    url: '/store/case/getCaseInfo/' + id,
    method: 'get'
  })
}

export function caseDeleteById(data) { // 删除客户合作示例
  return request({
    url: '/store/case/delete/' + data,
    method: 'get'
  })
}

export function changeStatus(data) { // 更改客户合作示例上架状态
  return request({
    url: '/store/case/changeAdded',
    method: 'post',
    data
  })
}

export function getRealm() { // 领域列表
  return request({
    url: '/service/getRealm',
    method: 'get'
  })
}
