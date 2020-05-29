<template>
  <div class="content_list headerForm">
    <div class="catetory_btn">
      <el-button type="primary" @click="batchShelf(1)">批量上架</el-button>
      <el-button type="primary" @click="batchShelf(0)">批量下架</el-button>
      <el-button class="fr" type="primary" @click="clickAdd">添加</el-button>
    </div>
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="上刊图片画面" name="1" />
      <el-tab-pane label="上刊视频画面" name="2" />
    </el-tabs>
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="媒体类型">
        <el-select v-model="form.media_type" placeholder="全部" clearable>
          <el-option label="全部" value="" />
          <el-option v-for="item in media" :key="item.id" :label="item.type_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="上刊领域">
        <el-select v-model="form.realm" placeholder="全部" clearable>
          <el-option label="全部" value="" />
          <el-option v-for="item in field" :key="item.id" :label="item.sr_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="form.status" class="w_100" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="form.on_sale" class="w_100" placeholder="请选择" clearable>
          <el-option
            v-for="item in shelfStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" clearable placeholder="上刊名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" min-width="60px" />
      <el-table-column prop="id" label="编号" width="100" align="center" />
      <el-table-column min-width="300px" align="center" label="上刊名称">
        <template slot-scope="scope">
          <div class="mianImg">
            <img class="serviceImg" :src="scope.row.image_s | completePicture">
            <div class="right">
              <div>{{ scope.row.name }}</div>
              <!--              <div>{{ scope.row.cate_name }}</div>-->
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="150" align="center">
        <template slot-scope="scope">￥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column prop="sr_name" label="上刊领域" min-width="100" align="center" />
      <el-table-column prop="type_name" label="媒体类型" width="100" align="center" />
      <el-table-column label="审核状态" min-width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{ scope.row.status | examineStateF }}
          </el-tag>
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason" />
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="上架状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.on_sale"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.status !== 1"
            @change="checkSwitch(scope.row.id,scope.row.on_sale,scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button class="mb_10" size="mini" type="primary" @click="editview(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="ondelete(scope.row.id)">删除</el-button>
          <el-button
            v-if="scope.row.status === 2"
            size="mini"
            type="primary"
            @click="onSubmit(scope.row.id,scope.$index)"
          >提交审核
          </el-button>
          <el-button size="mini" type="text">
            <a target="_blank" :href="('/post/'+scope.row.id) | prefixUrlF">
              详情
            </a>
          </el-button>
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
    <add-last-issue v-if="addFlag" @close="emitClose" @submit="emitSubmit" />
  </div>
</template>
<script>
import {
  listRequest,
  checkRequest,
  delRequest,
  serviceRealm,
  mediaType, journalApplyRequest
} from '@/api/cms/lastIssue'
import AddLastIssue from './components/addLastIssue'
import { examineForm, shelfState } from '@/utils/commonData'
import PopoverCpn from '@/components/PopoverCpn'

export default {
  name: 'LastIssueManage',
  components: { PopoverCpn, AddLastIssue },
  data() {
    const { type = '1' } = this.$route.query
    return {
      statusList: examineForm,
      shelfStates: shelfState,
      action: type + '', //	是	int	类型：1图片，2视频
      typeList: [],
      list: [],
      selectIndex: 0,
      total: 0,
      form: {
        page: 1,
        pageSize: 15,
        status: '', //	否	string	审核状态：0未审核，1已通过，2未通过
        realm: '', //	否	int	上刊领域
        on_sale: '', //	否	string	上架状态：0已下架，1已上架
        name: '', //	否	string	上刊名称
        media_type: ''//	否	int	媒体类型id
      },
      canPublish: '',
      hasPublish: '',
      multipleSelect: [],
      field: [],
      media: [],
      addFlag: false,
      selectId: ''
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getList()
      this.getField()
      this.getMedia()
    },
    onSubmit(id, index) {
      this.selectId = id
      console.log(id)
      this.journalApplyHttp(id, index)
    },
    clickAdd() {
      this.$router.push({
        path: `/product_manage/${this.action === '1' ? 'addLastIssueImage' : 'addLastIssueVideo'}`,
        query: { type: this.action, can: this.canPublish, has: this.hasPublish, id: this.selectId }
      })
    },
    editview(id = '') {
      this.selectId = id
      this.$router.push({ // can: this.canPublish, has: this.hasPublish,
        path: `/product_manage/${this.action === '1' ? 'editLastIssueImage' : 'editLastIssueVideo'}`,
        query: { type: this.action, id: this.selectId }
      })
    },
    emitClose() {
      this.addFlag = false
    },
    emitSubmit(val) {
      this.emitClose()
      this.form.page = 1
      this.initData()
    },
    checkSwitch(id, sale, index) {
      this.checkHttp(id, sale, index)
    },
    batchShelf(type) {
      if (this.multipleSelect.length === 0) {
        this.$message({
          message: '至少选择一项',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const ids = this.multipleSelect.map(item => item.id)
      this.checkHttp(ids, type)
    },
    ondelete(id) {
      this.deleteHttp(id)
    },
    handleSelectionChange(val) {
      this.multipleSelect = val
    },

    handleClick(tab, event) {
      this.action = tab.name
      this.form.page = 1
      this.getList()
    },
    handleSearchList() { // 搜索查询事件
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
      listRequest(+this.action, this.form).then(res => {
        const { data = [], total = 0 } = res.list
        this.list = data
        this.total = total
        this.canPublish = res.can_publish
        this.hasPublish = res.has_publish
      }).catch((err) => {
        console.log(err)
      })
    },
    checkHttp(ids, type, index = -1) {
      const param = {
        ids: ids, //	是	int/array	上刊画面id（单个或多个id）
        type: type //	是	int	0下架，1上架
      }
      checkRequest(param).then(res => {
        if (index === -1) {
          this.getList()
        } else {
          const data = this.list[index]
          data.on_sale = type
          this.$set(this.list, index, data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    deleteHttp(id) {
      delRequest(id).then(res => {
        this.getList()
        this.$message({ message: '删除成功', type: 'success' })
      }).catch((err) => {
        console.log(err)
      })
    },
    getField() {
      serviceRealm().then(res => {
        this.field = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    getMedia() {
      mediaType().then((res) => {
        if (res.code === 1) {
          this.media = res.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    journalApplyHttp(id, index) {
      journalApplyRequest(id).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: res.message })
        } else {
          // this.getList()
          const data = this.list[index]
          data.status = 0
          this.$set(this.list, index, data)
          this.$message.success({ message: '提交审核成功，管理员会在72小时内完成审核，请耐心等待。' })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .catetory_btn {
    margin-bottom: 20px;
  }

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
    width: 50px;
    height: 30px;
  }
</style>
