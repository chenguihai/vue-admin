import request from '@/utils/request'

export function servicelist(data) { // 服务列表
  return request({
    url: '/service/list',
    method: 'POST',
    data
  })
}

export function getshelf(data) { // 服务上架
  return request({
    url: '/service/shelf',
    method: 'POST',
    data
  })
}

export function getlabel(data) { // 设置标签
  return request({
    url: '/service/label',
    method: 'POST',
    data
  })
}

export function deleteservice(data) { // 服务删除
  return request({
    url: '/service/delete',
    method: 'POST',
    data
  })
}

export function getservicedata() { // 获取基本信息的下拉数据
  return request({
    url: '/service/showadd',
    method: 'POST'
  })
}

export function getbranddata(data) { // 获取品牌下拉数据
  return request({
    url: '/service/brand',
    method: 'POST',
    data
  })
}

export function baseInfoAdd(data) { // 基本信息保存
  return request({
    url: '/service/add',
    method: 'POST',
    data
  })
}
export function baseInfoEdit(data) { // 基本信息编辑保存
  return request({
    url: '/service/edit',
    method: 'POST',
    data
  })
}
export function getEditBaseInfo(data) { // 基本信息编辑页面
  return request({
    url: '/service/showedit',
    method: 'POST',
    data
  })
}

export function detailsedit(data) { // 服务编辑--详细介绍保存
  return request({
    url: '/service/edit',
    method: 'post',
    data
  })
}
export function serviceAudit(data) { // 服务编辑--提交审核
  return request({
    url: '/service/audit',
    method: 'post',
    data
  })
}
