import request from '@/utils/request'

export function getInvoiceList(data) { // 订单发票 - 发票列表
  return request({
    url: '/service/invoice/list',
    method: 'POST',
    data
  })
}

export function getOrderRefundist(data) { // 订单退款 - 订单退款列表
  return request({
    url: '/service/order/refundList',
    method: 'POST',
    data
  })
}

export function orderRefundStatus(data) { // 订单退款
  return request({
    url: '/service/order/refundStatus',
    method: 'POST',
    data
  })
}

export function getCommentList(data) { // 订单评价 - 服务订单评价列表
  return request({
    url: '/service/comment/list',
    method: 'POST',
    data
  })
}

export function invoiceStatus(data) { // 订单发票 - 发票状态
  return request({
    url: '/service/invoice/status',
    method: 'POST',
    data
  })
}
