<template>
  <div class="content_list headerForm">
    <el-form :inline="true" size="small">
      <el-form-item label="批量操作">
        <el-select v-model="batchSelect" clearable value-key="id" placeholder="请选择内容">
          <el-option
            v-for="(item,index) in batch"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="selectList.length === 0 || !batchSelect"
          @click="batchOperation"
        >确定</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="addservice">添加服务</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="small" :model="form">
      <el-form-item label="服务分类">
        <el-cascader v-model="cateSelect" :props="optionProps" :options="serviceClass" clearable />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="form.brand" class="w_130" placeholder="请选择" clearable>
          <el-option label="全部" value />
          <el-option
            v-for="item in brand_list"
            :key="item.id"
            :label="item.brand_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="form.status" class="w_100" placeholder="全部" clearable>
          <el-option label="全部" value />
          <el-option v-for="(item,index) in statusList" :key="index" :label="item" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="form.shelf_status" class="w_100" placeholder="全部" clearable>
          <el-option
            v-for="item in shelfoptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店内标签">
        <el-select
          v-model="labelSelect"
          class="w_100"
          placeholder="全部"
          clearable
          @clear="clearStoreLabel"
        >
          <el-option label="全部" value="=" />
          <el-option
            v-for="item in shoplabel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.id" placeholder="服务ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchListPage">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border @select-all="selectall" @select="singleSelect">
      <el-table-column type="selection" align="center" min-width="50px" />
      <el-table-column prop="id" min-width="100px" align="center" label="编号" />
      <el-table-column min-width="500px" align="center" label="服务名称/主图/分类">
        <template slot-scope="scope">
          <div class="mianImg">
            <img class="serviceImg" :src="scope.row.img | completePicture">
            <div class="right">
              <div>{{ scope.row.name }}</div>
              <div>{{ scope.row.cate_name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="品牌">
        <template slot-scope="scope">
          <img
            v-if="scope.row.brand_logo"
            class="brandImg"
            :src="scope.row.brand_logo | brandPicture"
          >
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="价格">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" min-width="100px" align="center" label="库存" />
      <el-table-column min-width="100px" align="center" label="审核状态">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.status ===2"
            class="item"
            effect="dark"
            :content="scope.row.reason"
            placement="top-start"
          >
            <el-tag type="danger">{{ scope.row.status_name }}</el-tag>
          </el-tooltip>
          <span v-else>{{ scope.row.status_name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="上架状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.shelf_status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.status !== 1"
            @change="shelfChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="店内热门">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.hot_status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status !== 1"
            @change="labelChange(scope.row,'hot_status')"
          />
        </template>
      </el-table-column>

      <el-table-column min-width="80px" align="center" label="店内精品">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.qua_status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status !== 1"
            @change="labelChange(scope.row,'qua_status')"
          />
        </template>
      </el-table-column>

      <el-table-column min-width="80px" align="center" label="店内新品">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.new_status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status !== 1"
            @change="labelChange(scope.row,'new_status')"
          />
        </template>
      </el-table-column>
      <!--      190px-->
      <el-table-column fixed="right" align="center" label="操作" min-width="230px">
        <template slot-scope="scope">
          <el-button
            v-show="!(scope.row.status ===1 && scope.row.shelf_status ===1)"
            class="mb_10"
            size="mini"
            type="primary"
            @click="editview(scope.row.id,0)"
          >修改</el-button>
          <el-button class="mb_10" size="mini" type="text">
            <a
              target="_blank"
              :href="`/service/${scope.row.id}?id=${storeId}&type=service` | prefixUrlF"
            >详情</a>
          </el-button>
          <el-button size="mini" @click="editview(scope.row.id,3)">规格</el-button>
          <el-button
            v-if="scope.row.status === 2"
            style="margin-left: 0"
            size="mini"
            type="primary"
            @click="onSubmit(scope.row.id,scope.$index)"
          >提交审核</el-button>
          <el-button size="mini" type="danger" @click="deleter(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-list">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        :page-size="per_page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
<script>
import { shopLabel, batchOperation, shelfState } from '@/utils/commonData'
import {
  servicelist,
  getshelf,
  getlabel,
  deleteservice,
  serviceAudit
} from '@/api/service.js'

export default {
  name: 'ServiceManage',
  data() {
    return {
      page: 1,
      per_page: 0,
      total: 0,
      selectList: [], // 选中的列表
      labelSelect: '=', // 店内标签model
      selectKey: '', // storeLabel选中的标签
      batch: batchOperation,
      shoplabel: shopLabel,
      shelfoptions: shelfState,
      list: [],
      brand_list: [],
      serviceClass: [],
      batchSelect: '', // 批量的选择
      cateSelect: [], // 服务分类的选择
      form: {
        page: 1, // 是	integer	页码
        brand: undefined, // 否	integer	品牌id
        status: '', // 否	integer	状态:0 待审核，1 通过，2 拒绝
        shelf_status: '', // 上架状态:0下架，1上架
        // hot_status: '',//否	integer	店内热门状态:0关闭，1开启
        // qua_status: '',//否	integer	店内精品状态:0关闭，1开启
        // new_status: '',//否	integer	店内新品状态:0关闭，1开启
        name: undefined, // 否	string	名称
        id: undefined, // 否	integer	id
        cate_id: undefined // 否	string	一二三级分类类目id，逗号隔开(1,2,3)
      },
      statusList: [], // 审核状态
      optionProps: {
        value: 'id',
        label: 'cate_name',
        children: 'child'
      },
      storeId: ''
    }
  },
  created() {
    const storeId = localStorage.getItem('shopInfo')
    if (storeId) {
      this.storeId = JSON.parse(storeId).id
    }
    this.getList()
  },
  methods: {
    onSubmit(id, index) {
      this.serviceAuditFun(id, index)
    },
    searchListPage() {
      // 搜索列表的页面的内容
      const [key = ''] = this.labelSelect.split('=')
      const data = ['hot_status', 'qua_status', 'new_status']
      for (let i = 0; i < data.length; i++) {
        if (data[i] === key) {
          this.form[key] = 1
        } else {
          this.form[data[i]] = undefined
        }
      }
      this.form = {
        ...this.form,
        page: 1,
        cate_id: this.cateSelect.toString()
      }
      this.getList()
    },
    clearStoreLabel(value) {
      const data = JSON.parse(JSON.stringify(this.form))
      delete data[this.selectKey]
      this.form = data
    },
    batchOperation() {
      // 批量操作
      const [key, value] = this.batchSelect.split('=')
      const selectId = this.selectList.map(item => item.id)
      if (key === 'delete') {
        this.deleteServiceFun(selectId)
      } else {
        const params = {
          // id: +selectId,	// 是	integer	服务id,多个值用逗号隔开
          id: selectId.toString(), // 是	integer	服务id,多个值用逗号隔开
          [key]: +value
        }
        if (key === 'status') {
          this.setShelfFun(params)
        } else {
          this.setLabelFun(params)
        }
      }
    },
    setLabelFun(params) {
      // 设置标签
      getlabel(params)
        .then(res => {
          if (res.code === 200) {
            this.getList(this.page)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    setShelfFun(params) {
      // 设置上架和下架
      getshelf(params)
        .then(res => {
          if (res.code === 200) {
            this.getList(this.page)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    serviceAuditFun(id, index) {
      // 提交审核
      serviceAudit({ id: '' + id })
        .then(res => {
          if (res.code === 1) {
            this.getList()
            // const data = this.list[index]
            // data.status = 0
            // data.status_name = '待审核'
            // this.$set(this.list, index, data)
          } else {
            this.$message.error(res.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteServiceFun(idList) {
      // 批量删除服务
      const params = {
        id: idList.toString()
      }
      deleteservice(params)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectall(list) {
      // 全部选中触发
      this.selectList = list
    },
    singleSelect(list) {
      this.selectList = list
    },
    getList() {
      const data = JSON.parse(JSON.stringify(this.form))
      const {
        brand,
        status,
        shelf_status,
        name,
        id
      } = data
      brand === '' && delete data.brand
      id === '' && delete data.id
      name === '' && delete data.name
      status === '' && delete data.status
      shelf_status === '' && delete data.shelf_status
      // data[this.selectKey] === '' && delete data[this.selectKey]
      this.cateSelect.length === 0 && delete data.cate_id
      servicelist(data)
        .then(res => {
          if (res.code === 200) {
            const {
              data = [],
              total = 0,
              status = [],
              per_page = 0,
              cate = [],
              brand = []
            } = res.data
            this.selectList = []
            this.list = data
            this.total = total;
            // eslint-disable-next-line no-sequences
            (this.per_page = per_page),
            (this.statusList = status),
            (this.serviceClass = cate),
            (this.brand_list = brand)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handlePageChange(val) {
      // 分页事件--当前选中页面
      this.form.page = val
      this.getList()
    },
    addservice() {
      // 添加服务
      this.$router.push({
        path: '/product_manage/edit_service'
      })
    },
    deleter(index, ider) {
      // 表格删除操作
      this.$confirm('您确认删除此条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteservice({ id: ider + '' })
            .then(res => {
              if (res.code === 200) {
                this.list.splice(index, 1) // 删除数据
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    labelChange(rows, type) {
      // 表格内--设置标签
      let objer = {}
      switch (type) {
        case 'hot_status':
          objer = {
            id: rows.id + '',
            hot_status: rows.hot_status
          }
          break
        case 'qua_status':
          objer = {
            id: rows.id + '',
            qua_status: rows.qua_status
          }
          break
        case 'new_status':
          objer = {
            id: rows.id + '',
            new_status: rows.new_status
          }
          break
      }
      getlabel(objer)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    shelfChange(row) {
      // 表格内服务上架切换状态事件
      const statusval = row.shelf_status ? 1 : 0
      const objer = {
        id: row.id + '',
        status: statusval
      }
      getshelf(objer)
        .then(res => {
          if (res.code === 200) {
            this.$message({ type: 'success', message: '操作成功' })
          } else {
            this.$message({ type: 'error', message: '操作失败' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    editview(id, type) {
      // 查看编辑页面
      this.$router.push({
        path: '/product_manage/edit_service',
        query: {
          id: id,
          type: type
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mianImg {
  display: flex;
  align-items: center;

  .right {
    text-align: left;
  }
}

.serviceImg {
  width: 100px;
  height: 60px;
  margin-right: 10px;
}

.brandImg {
  width: 90px;
  /*height: 38px;*/
}
</style>
