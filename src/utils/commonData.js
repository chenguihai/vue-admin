export const shopLabel = [
  {
    value: 'hot_status=1',
    label: '店内热门'
  }, {
    value: 'new_status=1',
    label: '店内新品'
  }, {
    value: 'qua_status=1',
    label: '店内精品'
  }
]
export const reportState = [ // 处理状态：0 待审核，1 举报通过，2 举报失败
  { label: '全部', value: '' },
  { label: '待审核', value: 0 },
  { label: '举报通过', value: 1 },
  { label: '举报失败', value: 2 }
]
export const batchOperation = [
  {
    value: 'status=1',
    label: '上架'
  }, {
    value: 'status=0',
    label: '下架'
  }, {
    value: 'hot_status=1',
    label: '店内热门'
  }, {
    value: 'hot_status=0',
    label: '取消店内热门'
  }, {
    value: 'new_status=1',
    label: '店内新品'
  }, {
    value: 'new_status=0',
    label: '取消店内新品'
  }, {
    value: 'qua_status=1',
    label: '店内精品'
  }, {
    value: 'qua_status=0',
    label: '取消店内精品'
  }, {
    value: 'delete=1',
    label: '删除'
  }
]
export const shelfState = [{
  value: '',
  label: '全部'
}, {
  value: 1,
  label: '已上架'
}, {
  value: 0,
  label: '已下架'
}]
export const clueStatus = [{ // = N:已关闭,Y:未关闭'
  value: '',
  label: '全部'
}, {
  value: 'N',
  label: '已关闭'
}, {
  value: 'Y',
  label: '未关闭'
}]
export const timeObject = [
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '最近7天', value: 'week' },
  { label: '最近30天', value: 'month' }
]

export const examineForm = [
  { label: '全部', value: '' },
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '未通过', value: 2 }
]
export const orderStatusForm = [ // 订单状态：0 待付款 1 已成交，2 未成交
  { label: '全部', value: '' },
  { label: '待支付', value: 0 },
  { label: '已成交', value: 1 },
  { label: '未成交', value: 2 }
]
export const orderForm = [ // 订单状态：1 待支付 2 已成交，3 未成交
  { label: '全部', value: '' },
  { label: '待支付', value: 1 },
  { label: '已成交', value: 2 },
  { label: '未成交', value: 3 }
]
export const typeForm = [ // 类型： 1 图片，2 视频
  { label: '全部', value: '' },
  { label: '图片', value: 1 },
  { label: '视频', value: 2 }
]
