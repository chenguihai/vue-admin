<template>
  <div class="content_list headerForm">
    <div class="catetory_btn">
      <el-button type="primary" @click="batchShelf(1)">批量上架</el-button>
      <el-button type="primary" @click="batchShelf(0)">批量下架</el-button>
      <el-button class="fr" type="primary" @click="clickAdd">添加{{ titles }}</el-button>
    </div>
    <!--表单-->
    <el-form :inline="true" :model="form" size="small" class="headerForm">
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
        <el-input v-model="form.name" clearable :placeholder="titles+'名称'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" min-width="50px" />
      <el-table-column prop="id" label="编号" width="100" align="center" />
      <el-table-column min-width="300px" align="center" :label="(selectType === 1 ?'媒体案列':'媒主传记')+'名称/缩略图'">
        <template slot-scope="scope">
          <div class="mianImg">
            <img class="serviceImg" :src="scope.row.img | completePicture">
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
      <el-table-column fixed="right" align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="{mb_10:scope.row.status === 2}"
            type="primary"
            @click="clickEdit(scope.row.id)"
          >编辑
          </el-button>
          <el-button size="mini" :class="{mb_10:scope.row.status === 2}" type="danger" @click="ondelete(scope.row.id)">
            删除
          </el-button>
          <el-button
            v-if="scope.row.status === 2"
            size="mini"
            style="margin-left: 0"
            type="primary"
            @click="onSubmit(scope.row.id,scope.$index)"
          >提交审核
          </el-button>
          <el-button size="mini" type="text"><a
            target="_blank"
            :href="`/case-biog/${scope.row.id}?id=${scope.row.store_id}&type=${type === 1?'case':'biog'}` | prefixUrlF"
          >
            详情
          </a></el-button>
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
import { listReq, batchReq, delReq, caseBiogApplyReq } from '@/api/content/media'
import { examineForm, shelfState } from '@/utils/commonData'
import { formatDate } from '@/utils/common'
import PopoverCpn from '@/components/PopoverCpn'

export default {
  name: 'MediaManage',
  components: { PopoverCpn },
  props: ['type'],
  data() {
    return {
      statusList: examineForm,
      shelfStates: shelfState,
      action: '1', //	是	int	类型：1图片，2视频
      typeList: [],
      list: [],
      timeArray: [],
      selectId: 0,
      selectIndex: 0,
      total: 0,
      selectType: this.type, //	是	int	类型：1案例，2传记
      titles: this.type === 1 ? '案例' : '传记',
      form: {
        page: 1,
        pageSize: 15,
        status: '', //	否	string	审核状态：0 待审核，1已通过，2未通过
        on_sale: '', //	否	string	上架状态：0已下架，1已上架
        name: ''//	否	string	案例传记名称
      },
      canPublish: '',
      hasPublish: '',
      multipleSelect: [],
      addFlag: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit(id, index) {
      this.selectId = id
      this.caseBiogApplyHttp(id, index)
    },
    clickAdd() {
      this.$router.push({
        path: `/product_manage/${this.selectType === 1 ? 'addMedia' : 'addBiography'}`,
        query: { can: this.canPublish, has: this.hasPublish, type: this.selectType }
      })
    },
    clickEdit(id) { // can: this.canPublish, has: this.hasPublish,
      this.$router.push({
        path: `/product_manage/${this.selectType === 1 ? 'addMedia' : 'addBiography'}`,
        query: { id: id, type: this.selectType }
      })
    },
    emitClose() {
      this.addFlag = false
    },
    emitSubmit(val) {
      if (this.selectId) {
        this.editHttp(val)
      } else {
        this.addHttp(val)
      }
      this.emitClose()
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
      listReq(+this.selectType, this.form).then(res => {
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
      batchReq(param).then(res => {
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
    caseBiogApplyHttp(id, index) {
      caseBiogApplyReq(id).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: res.message })
        } else {
          const data = this.list[index]
          data.status = 0
          this.$set(this.list, index, data)
          this.$message.success({ message: '提交审核成功，管理员会在72小时内完成审核，请耐心等待。' })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    deleteHttp(id) {
      delReq(id).then(res => {
        this.getList()
        this.$message({ message: '删除成功', type: 'success' })
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
