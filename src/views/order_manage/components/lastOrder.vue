<template>
  <div class="content_list headerForm">
    <!--表单-->
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="下单时间">
        <el-date-picker @change="daterangeChange"
                        v-model="timeArray"
                        type="daterange"
                        range-separator="-"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type" class="w_100" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
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
        <el-input v-model="form.name" clearable placeholder="上刊画面名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="order_sn" label="订单编号" min-width="170" align="center"/>
      <el-table-column prop="created_at" label="下单时间" width="100" align="center"/>
      <el-table-column prop="nick_name" label="购买用户" min-width="150" align="center"/>
      <el-table-column label="类型" width="70" align="center">
        <template slot-scope="scope">{{ scope.row.type |mediaTypeF }}</template>
      </el-table-column>
      <el-table-column min-width="300px" align="center" label="上刊名称">
        <template slot-scope="scope">
          <div class="mianImg">
            <img class="serviceImg" :src="scope.row.image_s | completePicture">
            <div class="right">
              <div>{{ scope.row.goods_name }}</div>
              <!--              <div>{{ scope.row.cate_name }}</div>-->
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" min-width="150" align="center">
        <template slot-scope="scope">￥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{ scope.row.status | mediaStateF }}
          </el-tag>
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"/>
        </template>
      </el-table-column>
      <!--
      <el-table-column fixed="right" align="center" label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="clickEdit(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
      -->
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
  import { journalReq } from '@/api/content/media'
  import { orderStatusForm, typeForm } from '@/utils/commonData'
  import PopoverCpn from '@/components/PopoverCpn'

  export default {
    name: 'LastOrder',
    components: { PopoverCpn },
    props: ['type'],
    data() {
      return {
        statusList: orderStatusForm,
        typeList: typeForm,
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
          type: '', //	是	int	1 图片，2 视频
          name: '', //	否	int	上刊名称
          status: '', //	否	int	订单状态：0待付款 1已成交，2未成交
          start_time: '', //	否	int	下单时间-起始
          end_time: ''//	否	int	下单时间-结束
        },
        addFlag: false
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
      clickAdd() {
        this.$router.push({
          path: '/product_manage/addMedia',
          query: { can: this.canPublish, has: this.hasPublish, type: this.selectType }
        })
      },
      clickEdit(id) {
        this.$router.push({
          path: '/product_manage/addMedia',
          query: { id: id, can: this.canPublish, has: this.hasPublish, type: this.selectType }
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
        journalReq(this.form).then(res => {
          const { data = [], total = 0 } = res
          this.list = data
          this.total = total
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
