<template>
  <div class="content_list">
    <el-button class="mb_20" type="primary" @click="handleAdd">添加客服</el-button>
    <el-table :data="list" border>
      <el-table-column prop="id" align="center" label="编号" min-width="100px" />
      <el-table-column prop="kf_name" align="center" label="客服名称" min-width="140px" />

      <el-table-column prop="kf_account" min-width="110px" align="center" label="客服QQ号码" />

      <el-table-column prop="created_at" min-width="100px" align="center" label="添加时间" />

      <el-table-column min-width="100px" align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" min-width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <customer-edit
      v-if="editFlag"
      :title="title[titleIndex]"
      :list-item="listItem"
      @emitClose="handleClose"
      @emitSubmit="customerEditSubmit"
    />
  </div>
</template>

<script>
import { messageCommon } from '@/utils/common.js'
import CustomerEdit from '@/components/CustomerEdit'
import {
  customerServicesList,
  addCustomerServices,
  editCustomerServices,
  deleteCustomerService,
  changeStatus
} from '@/api/customerServiceApi'

export default {
  name: 'CustomerManage',
  components: { CustomerEdit },
  data() {
    return {
      editFlag: false,
      title: ['添加客服', '编辑客服'],
      titleIndex: 0,
      listItem: {},
      list: [],
      deleteId: 0
    }
  },
  created() {
    this.customerServicesListFun()
  },
  methods: {
    handleDelete(id) {
      this.deleteId = id
      this.$confirm('您确认删除此条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.list.splice(index, 1) //删除数据
          this.deleteCustomerServiceFun()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleStatusChange(row) {
      this.changeStatusFun(row)
    },
    handleClose() { // emit
      this.editFlag = false
    },
    customerEditSubmit(value) { // emit
      this.editFlag = false
      if (this.titleIndex === 1) {
        this.editCustomerServicesFun(value)
      } else {
        this.addCustomerServicesFun(value)
      }
    },
    handleAdd() {
      this.titleIndex = 0
      this.editFlag = true
      this.listItem = {}
    },
    handleEdit(index) {
      this.editFlag = true
      this.listItem = this.list[index]
      this.titleIndex = 1
    },
    customerServicesListFun() {
      customerServicesList().then(res => {
        if (res.code === 200) {
          this.list = res.data
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addCustomerServicesFun(params) {
      addCustomerServices(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '操作成功')
          this.customerServicesListFun()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    editCustomerServicesFun(params) {
      editCustomerServices(params, this.listItem.id).then(res => {
        if (res.code === 200) {
          messageCommon(this, '操作成功')
          this.customerServicesListFun()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteCustomerServiceFun() {
      deleteCustomerService(this.deleteId).then(res => {
        if (res.code === 200) {
          messageCommon(this, '操作成功')
          this.customerServicesListFun()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeStatusFun(item) {
      const params = {
        id: item.id, //	是	int	客服id
        status: item.status//	是	int	显示状态 0显示 1不显示
      }
      changeStatus(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '操作成功')
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

<style scoped="scoped" lang='scss'>
</style>
