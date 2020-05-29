import request from '@/utils/request'

export function addcatetory(data) { // 新增店铺分类
  return request({
    url: 'store/category/add',
    method: 'POST',
    data
  })
}

export function catetorylist(data, page) { // 店铺分类列表
  return request({
    url: 'store/category/list?page=' + page,
    method: 'POST',
    data: data
  })
}

export function catetorydelete(id) { // 店铺分类删除
  return request({
    url: 'store/category/delete/' + id,
    method: 'GET',
    data: id
  })
}

export function catetoryedit(id, data) { // 店铺分类编辑
  return request({
    url: 'store/category/edit/' + id,
    method: 'POST',
    data
  })
}

export function editStatus(data) { // 店铺分类编辑
  return request({
    url: 'store/category/editStatus',
    method: 'POST',
    data
  })
}
