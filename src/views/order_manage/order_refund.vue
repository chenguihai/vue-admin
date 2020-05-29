<template>
  <div class="content_list headerForm">
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="申请时间">
        <el-date-picker @change="daterangeChange"
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请原因">
        <el-select v-model="form.reason_id" clearable>
          <el-option label="全部" value="" />
          <el-option v-for="item of reasonList" :key="item.id" :label="item.reason" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" class="w_100" clearable>
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in statusList" :key="index" :label="item" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.nickname" placeholder="雇主昵称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.order_sn" placeholder="订单号" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="任务名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table row-class-name="table_box" :data="listData" border>
      <el-table-column prop="id" align="center" label="退款编号" min-width="80px" />

      <el-table-column prop="created_at" width="100px" align="center" label="申请时间" />

      <el-table-column prop="nickname" min-width="110px" align="center" label="雇主" />

      <el-table-column min-width="100px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type |orderRefundType }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="订单信息">
        <template slot-scope="scope">
          <div>订单号：{{ scope.row.order_sn }}</div>
          <div>{{ scope.row.name }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="apply_reason" min-width="150px" align="center" label="申请原因" />
      <el-table-column min-width="250px" align="center" label="详细描述">
        <template slot-scope="scope">
          <div class="desc">{{ scope.row.content || '' }}</div>
          <a
            v-for="(item,index) in scope.row.attach"
            v-if="item"
            class="link"
            :href="item | prefixPicture"
            target="_blank"
            download
          >附件{{ index }}</a>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="应退金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="状态">
        <template slot-scope="scope">
          <div>{{ scope.row.status }}</div>
          <popover-cpn
            v-if="scope.row.status ==='已拒绝'"
            :key="scope.row.id"
            :reason="scope.row.refuse_reason"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" min-width="150px">
        <template v-if="scope.row.status === '待处理'" slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAgree(scope.row.id)">同意</el-button>
          <el-button size="mini" @click="handleRefuse(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <operation-hint
      v-if="operaHintFlag"
      title="操作提示"
      content="您确认同意退款吗？同意后平台将赏金退回给雇主。"
      @emitSubmit="handleOperaHint"
      @emitClose="handleCloseDialog"
    />

    <refusal-reasons
      v-if="refusalReasonsFlag"
      @emitSubmit="handleRefusalReasons"
      @emitClose="handleCloseDialog"
    />
    <div class="page-list">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :page-size="per_page"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { messageCommon } from '@/utils/common.js'
import OperationHint from '@/components/OperationHint'
import RefusalReasons from '@/components/RefusalReasons'
import PopoverCpn from '@/components/PopoverCpn'
import { getOrderRefundist, orderRefundStatus } from '@/api/orderInvoiceApi'

export default {
  name: 'OrderRefund',
  components: { OperationHint, RefusalReasons, PopoverCpn },
  data() {
    return {
      operaHintFlag: false,
      refusalReasonsFlag: false,
      timeArray: [],
      statusList: [],
      reasonList: [],
      selectId: '',
      form: {
        page: 1,
        reason_id: '',
        status: '',
        order_sn: '',
        nickname: '',
        name: '',
        start_time: 0,
        end_time: 0
      },
      listData: [],
      total: 0,
      per_page: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    daterangeChange(val) {
      const [start = '', end = ''] = val || []
      this.form.start_time = start
      this.form.end_time = end
    },
    handlePageChange(val) { // 分页器：页码变更
      this.form.page = val
      this.getList()
    },
    searchList() { // 搜索
      // const [start_time, end_time] = formatSearchTime(this.timeArray)
      // this.form.start_time = start_time
      // this.form.end_time = end_time
      this.form.page = 1
      this.getList()
    },
    getList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const { reason_id, start_time, end_time, order_sn, status, nickname, name } = data
      !start_time && delete data.start_time
      !end_time && delete data.end_time
      !reason_id && delete data.reason_id
      !order_sn && delete data.order_sn
      status === '' && delete data.status
      !nickname && delete data.nickname,
      !name && delete data.name
      getOrderRefundist(data).then(res => {
        if (res.code === 200) {
          const { status = [], reason = [], data = [], total = 0, per_page = 0 } = res.data
          this.statusList = status
          this.reasonList = reason
          this.listData = data
          this.total = total
          this.per_page = per_page
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleAgree(id) { // 表格内操作--同意
      this.operaHintFlag = true
      this.selectId = id
    },
    orderRefundStatusFun(params) {
      orderRefundStatus(params).then(res => {
        if (res.code === 200) {
          this.handleCloseDialog()
          this.getList()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleRefuse(id) {
      this.selectId = id
      this.refusalReasonsFlag = true
    },
    submitForm() { // 表格内弹出窗口操作--拒绝
      this.invoiceinfo = false
      this.titles = '填写收票地址'
      this.address = true
    },
    handleOperaHint() {
      const params = {
        id: this.selectId, //	是	integer	退款id
        status: 1//	是	integer	状态:1退款,2拒绝
      }
      this.orderRefundStatusFun(params)
    },
    handleRefusalReasons(reason) {
      const params = {
        id: this.selectId, //	是	integer	退款id
        status: 2, //	是	integer	状态:1退款,2拒绝
        reason//	否	string	原因，状态为2的时候必填
      }
      this.orderRefundStatusFun(params)
    },
    handleCloseDialog() {
      this.operaHintFlag = false
      this.refusalReasonsFlag = false
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/mixin";

  .refuseReason {
    color: #f00;
    @include ellipsis(1);
  }

  .desc {
    @include ellipsis(2);
  }

  .link {
    color: #0a81f8;
    margin: 0 10px;
  }
</style>
