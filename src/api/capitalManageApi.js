import request from '@/utils/request'

export function storeSettle(params) { // 资金结算明细
  return request({
    url: '/storeSettle',
    method: 'get',
    params
  })
}
export function agentSettle(params) { // 代付账户明细
  return request({
    url: '/store/agentSettle',
    method: 'get',
    params
  })
}
