import request from '@/utils/request'

export function tipOffs(type, param) {
  return request({
    url: '/tipOffs/' + type,
    method: 'get',
    params: param
  })
}
export function tipOffType(param) { // 举报类型管理 - 列表
  return request({
    url: '/getTipOffType',
    method: 'get',
    params: param
  })
}
