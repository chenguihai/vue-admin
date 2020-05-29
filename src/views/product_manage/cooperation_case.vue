<template>
  <div class="content_list">
    <div class="catetory_btn">
      <el-button type="primary" @click="handleAdd">添加合作客户示例</el-button>
    </div>
    <el-table :data="list" border tooltip-effect="dark">
      <el-table-column prop="id" align="center" label="编号" min-width="100px" />
      <el-table-column align="center" label="示例名称/主图/服务分类" min-width="400px">
        <template slot-scope="scope">
          <div class="flexBox">
            <img class="left" :src="scope.row.image_url |completePicture" alt="">
            <div class="right">
              <div class="mixin_line-ellipses">{{ scope.row.case_name }}</div>
              <div>{{ scope.row.cate_name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customer_name" min-width="250px" align="center" label="客户名称" />
      <el-table-column min-width="150px" align="center" label="合作费用">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="sr_name" min-width="110px" align="center" label="客户所属领域" />

      <el-table-column min-width="80px" align="center" label="上架状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_added"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" min-width="220px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <!--          <el-button size="mini" @click="handleDetail(scope.row.id)">详情</el-button>-->
          <!--          shop/shop-cooperate?id=120-->
          <el-button type="danger" size="mini" @click="deleteExample(scope.row.id)">删除</el-button>
          <a class="ml_10" :href="scope.row.id | exampleUrlF" target="_blank">详情</a>
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
import { messageCommon } from '@/utils/common.js'
import { getCaseList, caseDeleteById, changeStatus } from '@/api/customerExampleApi'

export default {
  name: 'CooperationCase',
  data() {
    return {
      selectId: 0,
      total: 0,
      per_page: 0,
      page: 1,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleAdd() { // 添加合作客户示例跳转
      this.$router.push({
        // path: '/product_manage/newcooperation'
        path: '/product_manage/editcooperation'
      })
    },
    handleEdit(id) { // 表格内编辑跳转
      this.$router.push({
        path: '/product_manage/editcooperation',
        query: {
          id: id
        }
      })
    },
    handleDetail() {
      console.log('handleDetail')
    },
    getList() {
      getCaseList(this.page).then(res => {
        if (res.code === 200) {
          const { data = [], per_page = 0, total = 0 } = res.data
          this.list = data
          this.per_page = per_page
          this.total = total
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteExample(id) { // 表格内删除操作
      this.selectId = id
      this.$confirm('您确认删除此条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.list.splice(index, 1) //删除数据
        this.caseDeleteByIdFun()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    caseDeleteByIdFun() {
      caseDeleteById(this.selectId).then(res => {
        if (res.code === 200) {
          messageCommon(this, '删除成功')
          this.getList()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeStatusFun(item) {
      const { id, is_added } = item
      const params = {
        id, is_added
      }
      changeStatus(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '修改成功')
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleStatusChange(item) { // 上架状态switch切换状态
      this.changeStatusFun(item)
    },
    handlePageChange(val) { // 分页事件--当前选中页面
      this.page = val
      this.getList()
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .catetory_btn {
    margin-bottom: 20px;
    text-align: right;
  }

  .flexBox {
    display: flex;
    align-items: center;

    .left {
      width: 100px;
      height: 60px;
      margin-right: 10px;
    }

    .right {
      flex: 1;
      text-align: left;
    }
  }

  .mixin_line-ellipses {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    word-break: break-all;
    overflow: hidden;
    white-space: normal;
  }
</style>
