import request from '@/utils/request'

export function getServiceOrderList(data) { // 我的交易 - 服务订单列表
  return request({
    url: '/service/order/list',
    method: 'POST',
    data
  })
}

export function changeOrderPrice(data) { // 修改订单价格
  return request({
    url: '/service/order/changePrice',
    method: 'POST',
    data
  })
}

export function applyInvoice(data) { // 申请技术费发票
  return request({
    url: '/service/invoice',
    method: 'POST',
    data
  })
}

export function clueList(params) { // 商户线索列表
  return request({
    url: '/store/clue/list',
    method: 'get',
    params
  })
}

export function serviceInvoice(params) { // 申请技术费发票抬头
  return request({
    url: '/serviceOrderInvoice',
    method: 'get',
    params
  })
}

export function applySettle(data) { // 服务申请代付/编辑
  return request({
    url: '/service/order/applySettle',
    method: 'post',
    data
  })
}

export function getSettleApplyInfo(data) { // 查看服务申请代付
  return request({
    url: '/service/order/getSettleApplyInfo?order_sn=' + data,
    method: 'get'
  })
}
