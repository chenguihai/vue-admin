<template>
  <div>
    <div class="content_list">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="任务模式">
              <el-select v-model="form.region" placeholder="全部">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="任务状态">
              <el-select v-model="form.region" placeholder="全部">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="参与任务时间">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-input v-model="input3" placeholder="稿件编号、雇主、任务名称" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-col>
        </el-row>
      </el-form>

      <div class="app-container">
        <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="稿件编号" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.bianhao }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100px" align="center" label="参与任务时间">
            <template slot-scope="scope">
              <span>{{ scope.row.datatime }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="60px" align="center" label="雇主">
            <template slot-scope="scope">
              <span>{{ scope.row.employer }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100px" align="center" label="任务赏金">
            <template slot-scope="scope">
              <span>{{ scope.row.taskmoney }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100px" align="center" label="任务名称">
            <template slot-scope="scope">
              <span>{{ scope.row.taskname }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100px" align="center" label="任务模式">
            <template slot-scope="scope">
              <span>{{ scope.row.moder }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100px" align="center" label="任务状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="60px" align="center" label="是否中标">
            <template slot-scope="scope">
              <span>{{ scope.row.winning }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="60px" align="center" label="是否入围">
            <template slot-scope="scope">
              <span>{{ scope.row.competition }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="60px" align="center" label="获得赏金">
            <template slot-scope="scope">
              <span>{{ scope.row.money }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" min-width="250px">
            <template slot-scope="scope">
              <div v-if="scope.row.operation_status=='0'" style="text-align: left">
                <el-button size="mini">详情</el-button>
              </div>
              <div v-if="scope.row.operation_status=='1'" style="text-align: left">
                <el-button size="mini">详情</el-button>
                <el-button size="mini">签署合同</el-button>
              </div>
              <div v-if="scope.row.operation_status=='2'" style="text-align: left">
                <el-button size="mini">详情</el-button>
                <el-button size="mini">发起合同</el-button>
              </div>
              <div v-if="scope.row.operation_status=='3'" style="text-align: left">
                <el-button size="mini">详情</el-button>
                <el-button size="mini">查看雇主发票</el-button>
                <el-button size="mini">申请技术费发票</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-list">
        <el-pagination background layout="prev, pager, next" :total="total" />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ParticipateTask',
  data() {
    return {
      form: {
        region: ''
      },
      total: 0,
      list: [
        {
          id: 1,
          bianhao: 'SD5644',
          datatime: '2018-08-12',
          employer: '雇主1',
          taskmoney: '¥6565',
          taskname: '任务名称',
          moder: '投标',
          winning: 0,
          competition: 1,
          status: '待托管',
          money: '¥10250',
          operation_status: 0
        },
        {
          id: 2,
          bianhao: 'SD5644',
          datatime: '2018-06-12',
          employer: '雇主2',
          taskmoney: '¥6565',
          taskname: '任务名称',
          moder: '投标',
          winning: 0,
          competition: 1,
          status: '待托管',
          money: '¥10250',
          operation_status: 1
        },
        {
          id: 3,
          bianhao: 'SD5644',
          datatime: '2018-08-12',
          employer: '雇主1',
          taskmoney: '¥6565',
          taskname: '任务名称',
          moder: '投标',
          winning: 0,
          competition: 1,
          status: '待托管',
          money: '¥10250',
          operation_status: 3
        },
        {
          id: 4,
          bianhao: 'SD5644',
          datatime: '2018-06-12',
          employer: '雇主2',
          taskmoney: '¥6565',
          taskname: '任务名称',
          moder: '投标',
          winning: 0,
          competition: 1,
          status: '待托管',
          money: '¥10250',
          operation_status: 0
        },
        {
          id: 4,
          bianhao: 'SD5644',
          datatime: '2018-06-12',
          employer: '雇主2',
          taskmoney: '¥6565',
          taskname: '任务名称',
          moder: '投标',
          winning: 0,
          competition: 1,
          status: '待托管',
          money: '¥10250',
          operation_status: 0
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .linker {
    color: #1890ff;
    cursor: pointer;
  }
</style>
