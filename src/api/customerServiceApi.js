import request from '@/utils/request'

export function customerServicesList() { // 客服列表
  return request({
    url: '/store/customerServices/list',
    method: 'get'
  })
}

export function addCustomerServices(data) { // 新增客服
  return request({
    url: '/store/customerServices/add',
    method: 'post',
    data
  })
}

export function editCustomerServices(data, id) { // 编辑客服
  return request({
    url: '/store/customerServices/edit/' + id,
    method: 'post',
    data
  })
}

export function getServiceInfo(data) { // 获取客服详情
  return request({
    url: '/store/customerServices/getServicerInfo/' + data,
    method: 'get'
  })
}

export function deleteCustomerService(data) { // 删除客服
  return request({
    url: '/store/customerServices/delete/' + data,
    method: 'delete'
  })
}

export function changeStatus(data) { // 更改客服显示状态
  return request({
    url: '/store/customerServices/changeStatus',
    method: 'post',
    data
  })
}
