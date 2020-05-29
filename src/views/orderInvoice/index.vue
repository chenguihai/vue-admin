<template>
  <div class="content_list headerForm">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="雇主申请的发票" name="2"/>
      <el-tab-pane label="我申请的发票" name="1"/>
    </el-tabs>
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="申请时间">
        <el-date-picker @change="daterangeChange"
                        v-model="timeArray"
                        type="daterange"
                        range-separator="-"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
        />
      </el-form-item>
      <el-form-item label="发票类型">
        <el-select v-model="form.invoice_type" class="w_120" placeholder="全部">
          <el-option label="全部" value=""/>
          <el-option v-for="(value,key) of invoiceType" :key="key" :label="value" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" class="w_100" placeholder="全部">
          <el-option label="全部" value=""/>
          <el-option v-for="(item,index) in statusList" :key="index" :label="item" :value="index"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="form.order_sn" placeholder="订单号" clearable class="input-with-select"/>
      </el-form-item>
      <el-form-item label="抬头">
        <el-input v-model="form.company_name" placeholder="抬头" clearable class="input-with-select"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="收票人" clearable class="input-with-select"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" border :key="action">
      <el-table-column prop="created_at" align="center" label="申请时间" width="100px"/>

      <el-table-column min-width="400px" align="center" label="发票信息">
        <template slot-scope="scope">
          <!--个人   1 增值税普通发票-->
          <div class="orderinfo">
            <label>抬头:</label>
            <span>{{ scope.row.company_name }}</span>
          </div>
          <template v-if="scope.row.type ===2">
            <!--企业  1+2 增值税普通发票-->
            <div v-if="scope.row.invoice_type ===1" class="orderinfo">
              <label>纳税人识别号：</label>
              <span>{{ scope.row.taxpayer_id }}</span>
            </div>
            <!--企业 增值税专业发票-->
            <div v-else>
              <div class="orderinfo">
                <label>详细地址:</label>
                <span>{{ scope.row.registration_address }}</span>
              </div>
              <div class="orderinfo">
                <label>联系电话:</label>
                <span>{{ scope.row.registration_phone }}</span>
              </div>
              <div class="orderinfo">
                <label>开户银行:</label>
                <span>{{ scope.row.deposit_bank }}</span>
              </div>
              <div class="orderinfo">
                <label>银行卡号:</label>
                <span>{{ scope.row.bank_account }}</span>
              </div>
            </div>
          </template>
          <!--公共的部分-->
          <div class="orderinfo">
            <label>收票地址:</label>
            <span>{{ scope.row.addressPrefix }}{{ scope.row.address }}</span>
          </div>
          <div class="orderinfo">
            <label>收票人:</label>
            <span>{{ scope.row.name }} {{ scope.row.phone }}</span>
          </div>
        </template>
      </el-table-column>
      <!--          invoiceType-->
      <el-table-column prop="invoice_type_name" min-width="140px" align="center" label="发票类型"/>

      <el-table-column min-width="150px" align="center" label="发票金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" label="订单信息">
        <template slot-scope="scope">
          <div>订单号：{{ scope.row.order_sn }}</div>
          <div>下单用户：{{ scope.row.username }}</div>
          <div>下单时间：{{ scope.row.order_created }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="status_name" min-width="80px" align="center" label="状态"/>

      <el-table-column v-if="form.type === 2" fixed="right" align="center" label="操作" min-width="80px">
        <template v-if="scope.row.status === 0" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleOpenInvoice(scope.$index,scope.row.id)"
          >开票
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-list">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :page-size="per_page"
        :total="total"
        :hide-on-single-page="true"
        @current-change="handlePageChange"
      />
    </div>
    <operation-hint
      v-if="operaHintFlag"
      title="操作提示"
      content="您已确认开票，请及时将发票邮寄给雇主。"
      @emitSubmit="handleOperaHint"
      @emitClose="handleCloseDialog"
    />
  </div>
</template>

<script>
import { messageCommon, addressCommon } from '@/utils/common.js'
import { getInvoiceList, invoiceStatus } from '@/api/orderInvoiceApi.js'
import OperationHint from '@/components/OperationHint'

export default {
  name: 'ServiceOrder',
  components: { OperationHint },
  data() {
    return {
      statusList: [],
      invoiceType: {},
      timeArray: [],
      operaHintFlag: false,
      selectId: 0,
      selectIndex: 0,
      action: '2',
      form: {
        page: 1, //	是	integer	页码
        type: 2, //	否	integer	1雇主申请的发票，2服务商申请的发票
        status: '', //	是	integer	状态:0待开 1已开
        invoice_type: '', //	是	integer	发票类型1普通 2增值税专用
        start_time: 0, //	否	integer	搜索开始时间，例:2019-08-29
        end_time: 0, //	否	integer	搜索结束时间，例:2019-08-30
        name: '', //	否	string	收票人姓名
        company_name: '', //	否	string	抬头
        order_sn: ''//	否	string	定单号:'',//
      },
      listData: [],
      per_page: 0,
      total: 0
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
    handleClick(tab, event) {
      this.form.type = +tab.name
      this.form.page = 1
      this.getList()
    },
    handleSearch() { // 搜索按钮
      this.form.page = 1
      this.getList()
    },
    getList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const { invoice_type, start_time, end_time, name, company_name, order_sn, status } = data
      !start_time && delete data.start_time
      !end_time && delete data.end_time
      !name && delete data.name
      !company_name && delete data.company_name
      !order_sn && delete data.order_sn
      !invoice_type && delete data.invoice_type
      status === '' && delete data.status
      getInvoiceList(data).then(res => {
        if (res.code === 200) {
          const { status = [], invoice_type_name = {}, data = [], per_page = 0, total = 0 } = res.data
          this.statusList = status
          this.invoiceType = invoice_type_name
          this.per_page = per_page
          this.total = total
          this.listData = addressCommon(data)
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleOpenInvoice(index, id) {
      this.operaHintFlag = true
      this.selectIndex = index
      this.selectId = id
    },
    invoiceStatusFun() {
      const params = {
        id: this.selectId, //	是	integer	发票id,多个值用逗号隔开
        status: 1//	是	integer	状态:0未开票，1开票
      }
      invoiceStatus(params).then(res => {
        if (res.code === 200) {
          this.operaHintFlag = false
          // const data = this.listData[this.selectIndex]
          // data.status = 1
          // this.$set(this.listData, this.selectIndex, data)
          this.getList()
        } else {
          messageCommon(this, res.message, 'error'
          )
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlePageChange(val) { // 分页点击
      this.form.page = val
      this.getList()
    },
    handleOperaHint() {
      this.invoiceStatusFun()
    },
    handleCloseDialog() {
      this.operaHintFlag = false
    }
  }
}
</script>

<style scoped lang="scss">
  .orderinfo {
    display: flex;
    align-items: center;

    label {
      font-weight: normal;
    }
  }

</style>
