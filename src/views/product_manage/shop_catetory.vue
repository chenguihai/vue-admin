<template>
  <div class="content_list">
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-input v-model="cname" clearable placeholder="请输入类目名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search_btn">查询</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" class="" @click="addStore">添加店铺分类</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格-->
    <el-table :data="list" row-key="id" border>
      <el-table-column prop="cat_name" align="center" label="分类名称" min-width="150" />
      <el-table-column prop="num" align="center" label="内容数量" min-width="100" />
      <el-table-column align="center" label="是否启用" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" align="center" label="排序" min-width="100" />
      <el-table-column fixed="right" prop="address" align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEdit(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="deleteStore(scope.$index,scope.row.cat_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <div class="page-list">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :page-size="per_page"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
    <!--      添加/编辑店铺分类-->
    <store-class
      v-if="storeFlag"
      :item="listItem"
      :type="status_btn"
      @emitClose="emitClose"
      @emitEdit="emitEdit"
      @emitAdd="emitAdd"
    />
  </div>
</template>

<script>
import { messageCommon } from '@/utils/common.js'
import { addcatetory, catetorylist, catetorydelete, catetoryedit, editStatus } from '@/api/catetory.js'
import StoreClass from '@/components/StoreClass'

export default {
  name: 'Catetory',
  components: { StoreClass },
  data() {
    return {
      listItem: {},
      cname: '',
      page: 1,
      list: [],
      total: 0,
      status_btn: 0,
      per_page: 0,
      storeFlag: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addStore() {
      this.listItem = ''
      this.storeFlag = true
      this.status_btn = '0'
    },
    showEdit(rows) {
      this.listItem = rows
      this.status_btn = '1'
      this.storeFlag = true
    },
    search_btn() { // 搜索按钮
      this.getList()
    },
    handlePageChange(val) { // 分页点击
      this.page = val
      this.getList()
    },
    getList() {
      const params = { cname: this.cname }
      !params.cname && delete params.cname
      catetorylist(params, this.page).then(res => {
        const { data = [], total = 0, per_page = 0 } = res
        this.list = data
        this.total = total
        this.per_page = per_page
      }).catch(err => {
        console.log(err)
      })
    },
    deleteStore(index, id) { // 删除表格内数据
      this.$confirm('您确认删除此条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStoreFun(id)
      }).catch(() => {
        messageCommon(this, '已取消删除', 'info')
      })
    },
    handleStatusChange(rows) { // 表格内是否启用
      const params = {
        id: rows.cat_id,
        is_show: rows.is_show
      }
      editStatus(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '操作成功')
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addStoreFun(params) {
      addcatetory(params).then(res => {
        if (res.code == 200) {
          messageCommon(this, '操作成功')
          this.emitClose()
          this.getList()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    editStoreFun(params, catId) {
      catetoryedit(catId, params).then(res => {
        if (res.code == 200) {
          this.emitClose()
          this.getList()
          messageCommon(this, '操作成功')
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteStoreFun(id) {
      catetorydelete(id).then(res => {
        if (res.code === 1) {
          // this.list.splice(index, 1) // 删除数据
          this.getList()
          messageCommon(this, '操作成功')
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    emitEdit(params, catId) { // emit
      this.editStoreFun(params, catId)
    },
    emitAdd(params) { // emit
      this.addStoreFun(params)
    },
    emitClose() { // emit
      this.storeFlag = false
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
</style>
