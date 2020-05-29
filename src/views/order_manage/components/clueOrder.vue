<template>
  <div class="headerForm">
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="线索状态">
        <el-select v-model="form.cluestatus" class="w_100" placeholder="全部" clearable>
          <el-option v-for="item of clueStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker @change="daterangeChange"
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.title" placeholder="线索名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="id" align="center" label="订单编号" min-width="100px" />
      <el-table-column prop="pay_time" min-width="100px" align="center" label="下单时间" />
      <el-table-column min-width="100px" align="center" label="线索状态">
        <template slot-scope="scope">{{ scope.row.clue_status | clueStatusF }}</template>
      </el-table-column>
      <el-table-column prop="title" min-width="130px" align="center" label="线索名称" />
      <el-table-column min-width="250px" label="联系方式">
        <template slot-scope="scope">
          <div>联系人：{{ scope.row.name }}</div>
          <div v-if="scope.row.mobile !== '' && scope.row.mobile !== '隐藏'">手机：{{ scope.row.mobile }}</div>
          <div v-if="scope.row.qq">QQ：{{ scope.row.qq }}</div>
          <div v-if="scope.row.wechat">微信：{{ scope.row.wechat }}</div>
          <div v-if="scope.row.email">Email：{{ scope.row.email }}</div>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="80px" align="center" label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_status |clueStatusF }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="80px">
        <template slot-scope="scope">
<!--          <el-button size="small" @click="deleter(scope.$index, scope.row.id)">详情</el-button>-->
          <a :href="scope.row.id | clueUrlF" target="_blank">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-list">
      <el-pagination background layout="prev, pager, next" :total="total" />
    </div>
  </div>
</template>

<script>
import { clueList } from '@/api/orderManageApi'
import { formatSearchTime, messageCommon } from '@/utils/common.js'
import { clueStatus } from '@/utils/commonData.js'

export default {
  name: 'Clue',
  data() {
    return {
      timeArray: [],
      total: 0,
      clueStatus: clueStatus,
      form: {
        page: 1, //	是	integer	页码
        time: '', // =2019-10-10,2019-10-25&
        title: '', // =测试
        cluestatus: ''// = N:已关闭,Y:未关闭'
      },
      list: []
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    daterangeChange(val) {
      const [startTime = '', endTime = ''] = val || []
      this.form.time = startTime ? `${startTime},${endTime}` : ''
    },
    handleSearch() { // 搜索按钮
      this.form.page = 1
      this.getAllList()
    },
    getAllList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const { time, title, cluestatus } = data
      !time && delete data.time
      !title && delete data.title
      !cluestatus && delete data.cluestatus
      clueList(data).then(res => {
        const { data = [], total = 0 } = res
        this.list = data
        this.total = total
        // messageCommon(this, res.message, 'error')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
