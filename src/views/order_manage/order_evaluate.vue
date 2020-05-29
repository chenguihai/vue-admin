<template>
  <div class="content_list headerForm">
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="评价时间">
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
      <el-form-item label="评价等级">
        <el-select v-model="form.evaluate" class="w_100" placeholder="全部" clearable>
          <el-option label="全部" value=""/>
          <el-option v-for="(value, key,index) of levelList" :key="index" :label="value" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.u_content" clearable placeholder="评价内容"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.order_sn" clearable placeholder="订单号"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column align="center" label="订单信息" min-width="400px">
        <template slot-scope="scope">
          <span class="orderinfo">
            <label>订单号：</label>
            <em>{{ scope.row.order_sn }}</em>
          </span>
          <span class="orderinfo">
            <label>雇主：</label>
            <em>{{ scope.row.nickname }}</em>
          </span>
          <span class="orderinfo">
            <label>任务订单：</label>
            <em>{{ scope.row.name }}</em>
          </span>
          <span class="orderinfo">
            <label>下单时间：</label>
            <em>{{ scope.row.order_created }}</em>
          </span>
          <span class="orderinfo">
            <label>成交金额：</label>
            <em>{{ scope.row.amount }}</em>
          </span>
        </template>
      </el-table-column>

      <el-table-column min-width="400px" align="center" label="雇主对我的评价">
        <template v-if="scope.row.u_content" slot-scope="scope">
          <span class="orderinfo">
            <label>评价等级：</label>
            <em>{{ scope.row.evaluate |evaluate }}</em>
          </span>
          <span class="orderinfo">
            <label>评分：</label>
            <em>服务态度 {{ scope.row.attitude }}分</em>
            <em>工作速度  {{ scope.row.speed }}分</em>
            <em>完成质量 {{ scope.row.quality }}分</em>
          </span>
          <span class="orderinfo">
            <label>评价内容：</label>
            <em>{{ scope.row.u_content }}</em>
          </span>
          <span class="orderinfo">
            <label>评价时间：</label>
            <em>{{ scope.row.u_time }}</em>
          </span>
        </template>
      </el-table-column>

      <el-table-column min-width="400px" align="center" label="我对雇主的评价">
        <template v-if="scope.row.s_content" slot-scope="scope">
          <span class="orderinfo">
            <label>评价等级：</label>
            <em>{{ scope.row.s_evaluate | evaluate }}</em>
          </span>
          <span class="orderinfo">
            <label>评价内容：</label>
            <em>{{ scope.row.s_content }}</em>
          </span>
          <span class="orderinfo">
            <label>评价时间：</label>
            <em>{{ scope.row.s_time }}</em>
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" min-width="110px">
        <template slot-scope="scope" v-if="!scope.row.s_content">
          <a class="mb_10 mr_20" target="_blank" :href="scope.row.order_sn | evaluateUrlF">评价雇主</a>
        </template>
      </el-table-column>
    </el-table>
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
import { formatTimeStamp, messageCommon } from '@/utils/common.js'
import { getCommentList } from '@/api/orderInvoiceApi'

export default {
  name: 'OrderEvaluate',
  data() {
    return {
      levelList: [],
      timeArray: [],
      total: 0,
      per_page: 20,
      form: {
        page: 1, //	是	integer	页码
        order_sn: '', //	否	string	定单号
        u_content: '', //	否	string	用户评价内容
        evaluate: '', //	否	integer	1是好评 2是中评 3是差评
        start_time: 0, //	否	integer	搜索开始时间，例:2019-08-29
        end_time: 0//	否	integer	搜索结束时间，例:2019-08-30
      },
      list: []
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
      this.form.page = 1
      this.getList()
    },
    getList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const { start_time, end_time, order_sn, evaluate, u_content } = data
      !start_time && delete data.start_time
      !end_time && delete data.end_time
      !order_sn && delete data.order_sn
      !evaluate ? delete data.evaluate : data.evaluate = +data.evaluate
      !u_content && delete data.u_content
      getCommentList(data).then(res => {
        if (res.code === 200) {
          const { level = {}, data = [], per_page = 0, total = 0 } = res.data
          for (let i = 0; i < data.length; i++) {
            data[i].created_at = data[i].created_at ? formatTimeStamp(new Date(data[i].created_at * 1000)) : ''
          }
          this.levelList = level
          this.list = data
          this.per_page = per_page
          this.total = total
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .orderinfo {
    display: block;
    text-align: left;

    label {
      display: inline-block;
      width: 70px;
      text-align: right;
      font-weight: normal;
    }

    em {
      font-style: normal;
    }
  }
</style>
