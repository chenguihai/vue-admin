<template>
  <div class="headerForm">
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          @change="daterangeChange"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="form.status" class="w_100" clearable placeholder="全部">
          <el-option value label="全部" />
          <el-option v-for="(value,key) in orderStatus" :key="key" :value="key" :label="value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.order_sn" placeholder="订单号" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.nickname" placeholder="雇主昵称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="服务名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="listData" border>
      <el-table-column align="center" label="订单编号" min-width="170px" prop="order_sn" />
      <el-table-column min-width="140px" align="center" label="雇主昵称" prop="nickname" />
      <el-table-column min-width="400px" align="center" label="服务信息">
        <template slot-scope="scope">
          <div class="serviceInfo">
            <div class="left">
              <img class="left_img" :src="scope.row.thumb | completePicture">
            </div>
            <div class="right">
              <span>{{ scope.row.name }}</span>
              <span>{{ scope.row.spec }}</span>
              <span>X {{ scope.row.number }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="服务价格">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.order_status | orderStateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" width="100px" align="center" label="订单时间" />
      <el-table-column align="center" fixed="right" label="操作" min-width="200px">
        <!--根据订单状态显示，如果订单状态是待签署（3）显示签署合同，如果订单状态是4（工作中）,5（待验收）,6（待评价）,7（已成交）显示查看合同。 8（已冻结）9（未成交）不显示-->
        <template slot-scope="scope">
          <div class="btn_box mb_10">
            <a class="cancel_btn mr_10" target="_blank" :href="scope.row.order_sn | originUrlF">详情</a>
            <a
              v-if="scope.row.sign ===3"
              class="save_btn"
              target="_blank"
              :href="scope.row.order_sn | originUrlF"
            >发起合同</a>
            <a
              v-else-if="scope.row.sign ===5"
              class="save_btn"
              target="_blank"
              :href="scope.row.order_sn | originUrlF"
            >签署合同</a>
            <a
              v-else-if="scope.row.sign ===6"
              class="save_btn"
              :href="scope.row.order_sn | contranctUrlF"
              target="_blank"
            >查看合同</a>
            <!--  1：待定-不显示状态 2：权限不足 3:未填充合同-发起合同 5：未有签名-签署合同 6：有签名-查看合同 7：订单不存在-->
          </div>
          <el-button
            v-if="scope.row.order_status===0 || scope.row.order_status===1"
            class="mb_10"
            size="mini"
            @click="modifyOrders(scope.row.order_sn)"
          >修改订单</el-button>
          <div v-else-if="scope.row.order_status===6 || scope.row.order_status===7">
            <el-button class="mb_10" size="mini" @click="checkInvoice">查看雇主发票</el-button>
            <el-button
              v-if="scope.row.has_invoice === 0"
              class="mb_10"
              size="mini"
              @click="applyInvoice(scope.row.order_sn)"
            >申请技术费发票</el-button>
          </div>
          <el-button
            v-else-if="scope.row.order_status===8 || scope.row.order_status===9"
            class="mb_10"
            size="mini"
            @click="viewrefund"
          >查看退款</el-button>
          <el-button
            v-if="scope.row.is_settle_apply===1"
            class="mb_10"
            size="mini"
            @click="viewApply(scope.row.order_sn,'view')"
          >查看结算申请</el-button>
          <el-button
            v-else-if="scope.row.order_status === 4 && scope.row.is_settle===1"
            size="mini"
            @click="viewApply(scope.row,'apply')"
          >结算申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页功能-->
    <div class="page-list">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :page-size="per_page"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
    <!--填写发票信息-->
    <ticket-info
      v-if="ticketInfoFlag"
      @emitCloseDialog="handleClose"
      @emitTicketInfo="ticketInfoHttp"
    />
    <!--填写收票地址-->
    <ticket-address
      v-if="ticketAddrFlag"
      @emitCloseDialog="handleClose"
      @emitTicketAddress="ticketAddressHttp"
    />
    <!--修改订单-->
    <edit-order-price
      v-if="editOrderFlag"
      @emitCloseDialog="handleClose"
      @emitOrderPrice="orderPriceChangeHttp"
    />
    <!--结算申请-->
    <settle-apply v-if="settleFlag" :item="selectItem" @close="handleClose" @submit="emitSubmit" />
    <!--查看结算申请-->
    <examine-apply v-if="examineFlag" :order="orderSn" @close="handleClose" @submit="emitExamine" />
  </div>
</template>

<script>
import { messageCommon } from '@/utils/common.js'
import {
  applyInvoice,
  applySettle,
  changeOrderPrice,
  getServiceOrderList
} from '@/api/orderManageApi'
import EditOrderPrice from '@/components/EditOrderPrice'
import TicketAddress from '@/components/TicketAddress'
import TicketInfo from '@/components/TicketInfo'
import SettleApply from './settleApply'
import ExamineApply from './examineApply'

export default {
  name: 'ServiceOrder',
  components: {
    ExamineApply,
    EditOrderPrice,
    TicketAddress,
    TicketInfo,
    SettleApply
  },
  data() {
    return {
      orderStatus: {}, // 订单状态
      total: 0,
      per_page: 0,
      timeArray: [],
      editOrderFlag: false, // 修改订单
      ticketAddrFlag: false, // 票据地址
      ticketInfoFlag: false, // 发票信息 false
      settleFlag: false, // false 结算申请
      examineFlag: false, // false 查看结算申请
      orderSn: '',
      selectItem: {},
      form: {
        // 列表搜索条件
        page: 1, //	是	integer	页码
        status: '', //	否
        order_sn: '', //	否	string	定单号
        start_time: 0, //	否	integer	搜索开始时间，例:2019-08-29
        end_time: 0, //	否	integer	搜索结束时间，例:2019-08-30
        name: '', //	否	string	服务名称
        nickname: '' //	否	string	用户昵称
      },
      params: {},
      listData: [] // 列表数据
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
    viewApply(order_sn, type) {
      if (type === 'view') {
        this.examineFlag = true
        this.orderSn = order_sn
      } else {
        this.settleFlag = true
        this.selectItem = order_sn
      }
    },
    getList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const { start_time, end_time, order_sn, status, name, nickname } = data
      !status ? delete data.status : (data.status = +data.status)
      !start_time && delete data.start_time
      !end_time && delete data.end_time
      !order_sn && delete data.order_sn
      !name && delete data.name
      !nickname && delete data.nickname
      getServiceOrderList(data)
        .then(res => {
          if (res.code === 200) {
            const { data, status, total, per_page } = res.data
            this.listData = data
            this.orderStatus = status
            this.total = total
            this.per_page = per_page
          } else {
            messageCommon(this, res.message, 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchList() {
      // 搜索按钮
      this.form.page = 1
      this.getList()
    },
    orderPriceChangeHttp(val) {
      // 修改 订单
      const params = {
        order_sn: this.orderSn, //	是	string	定单号
        amount: val //	是	decimal(10,2)	价格,例:1.99或1
      }
      changeOrderPrice(params)
        .then(res => {
          if (res.code === 200) {
            messageCommon(this, '修改成功')
            this.handleClose()
            this.getList()
          } else {
            messageCommon(this, res.message, 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ticketAddressHttp(val) {
      // 填写收票地址
      const [province, city, district] = val.addr
      delete val.addr
      this.params = {
        ...this.params,
        ...val,
        province,
        city,
        district,
        order_sn: this.orderSn
      }
      this.applyInvoiceFun()
    },
    ticketInfoHttp(val) {
      // 填写发票信息
      this.params = val
      this.handleClose()
      this.ticketAddrFlag = true
    },
    viewrefund() {
      // 查看退款跳转
      this.$router.push({
        path: '/order_manage/order_refund'
      })
    },
    checkInvoice() {
      this.$router.push({
        path: '/order_manage/orderInvoice'
      })
    },
    emitSubmit(params) {
      this.applySettleFun(params)
    },
    emitExamine(params) {
      this.examineFlag = false
      this.settleFlag = true
      this.selectItem = params
    },
    handleClose() {
      // 关闭弹框
      this.ticketAddrFlag = false
      this.editOrderFlag = false
      this.ticketInfoFlag = false
      this.settleFlag = false
      this.examineFlag = false
      this.selectItem = {}
    },
    handlePageChange(val) {
      // 分页点击
      this.form.page = val
      this.getList()
    },
    modifyOrders(order_sn) {
      this.orderSn = order_sn
      this.editOrderFlag = !this.editOrderFlag
    },
    applyInvoice(orderSn) {
      this.orderSn = orderSn
      this.ticketInfoFlag = true
    },
    applyInvoiceFun() {
      applyInvoice(this.params)
        .then(res => {
          if (res.code === 200) {
            this.handleClose()
            messageCommon(this, '操作成功')
            this.getList()
          } else {
            messageCommon(this, res.message, 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    applySettleFun(params) {
      applySettle(params)
        .then(res => {
          if (res.code === 200) {
            this.handleClose()
            messageCommon(this, '操作成功')
            this.getList()
          } else {
            messageCommon(this, res.message, 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.serviceInfo {
  display: flex;
  align-items: center;

  .left {
    width: 100px;

    .left_img {
      display: block;
      width: 100px;
      height: 60px;
    }
  }

  .right {
    margin-left: 10px;

    > span {
      display: block;
      text-align: left;
    }
  }
}
.btn_box {
  display: flex;
  align-items: center;
  justify-content: center;

  .save_btn,
  .cancel_btn {
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }

  .save_btn {
    color: #fff;
    background: #f3262d;
    &:hover {
      background-color: #f43c42;
    }
  }
}
</style>
