<template>
  <div class="content_list headerForm">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="我发起的举报" name="1"/>
      <el-tab-pane label="我收到的举报" name="2"/>
    </el-tabs>
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="举报时间">
        <el-date-picker @change="daterangeChange"
                        v-model="timeArray"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="举报类型">
        <el-select v-model="form.tip_offs_type" placeholder="全部" clearable>
          <el-option label="全部" value=""/>
          <el-option v-for="item in typeList" :key="item.id" :label="item.type" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="form.status" class="w_100" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="created_at" label="举报时间" width="100" align="center"/>
      <el-table-column prop="type" label="举报类型" min-width="110" align="center"/>
      <el-table-column prop="passive_name" label="被举报人" min-width="100" align="center"/>
      <el-table-column prop="project_name" label="举报项目" min-width="150" align="center"/>
      <el-table-column label="举报原因描述" min-width="400" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.description }}</div>
          <a v-for="(item,index) in scope.row.proof_imgs.split(',')" :key="index" class="jump"
             :href="item | prefixPicture"
             target="_blank">附件{{index}} </a>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" min-width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{ scope.row.status | reportState }}
          </el-tag>
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-list">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.page"
        :page-size="form.pageSize"
        :page-sizes="[15,30,50]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
<script>
  import { tipOffType, tipOffs } from '@/api/help/report'
  import { reportState } from '@/utils/commonData'
  import { formatDate } from '@/utils/common'
  import PopoverCpn from '@/components/PopoverCpn'

  export default {
    name: 'ReportManage',
    components: { PopoverCpn },
    data() {
      return {
        statusList: reportState,
        action: '1',
        typeList: [],
        list: [],
        timeArray: [],
        total: 0,
        formType: {
          page: 1,
          pageSize: 30
        },
        form: {
          page: 1,
          pageSize: 15,
          tip_offs_type: '', //	否	int	举报类型
          status: '', //	否	int	处理状态：0待审核，1通过，2未通过
          start_time: '', //	否	string	举报时间1
          end_time: ''//	否	string	举报时间2
        }
      }
    },
    created() {
      this.getList()
      this.getType()
    },
    methods: {
      daterangeChange(val) {
        const [start = '', end = ''] = val || []
        this.form.start_time = start
        this.form.end_time = end
      },
      handleClick(tab, event) {
        this.action = tab.name
        this.form.page = 1
        this.getList()
      },
      handleSearchList() { // 搜索查询事件
        const [startTime, endTime] = formatDate(this.timeArray)
        this.form.start_time = startTime
        this.form.end_time = endTime
        this.form.page = 1
        this.getList()
      },
      handleSizeChange(val) { // 分页器：页大小变更
        this.form.page = 1
        this.form.pageSize = val
        this.getList()
      },
      handlePageChange(val) { // 分页器：页码变更
        this.form.page = val
        this.getList()
      },
      getList() {
        tipOffs(this.action, this.form).then(res => {
          this.list = res.data
          this.total = res.total
        }).catch((err) => {
          console.log(err)
        })
      },
      getType() {
        tipOffType(this.formType).then(res => {
          const { data = [],code } = res
          if(code ===1){
            this.typeList = data
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .jump {
    /*color: #409EFF;*/
    display: inline-block;
    margin-right: 10px;
  }
</style>
