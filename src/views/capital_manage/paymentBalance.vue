<template>
  <div class="content_list headerForm">
    <ul class="total_bg">
      <li class="total_li">
        <span>
          {{ balanceObj.other_paid || 0 }}
          <em>元</em>
        </span>
        <p>可用余额</p>
      </li>
      <li class="total_li">
        <span>
          {{ balanceObj.other_paid_frozen || 0 }}
          <em>元</em>
        </span>
        <p>冻结金额</p>
      </li>
    </ul>
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="交易类型">
        <el-select v-model="form.trade_type_id" class="w_130" placeholder="全部" clearable>
          <el-option label="全部" value />
          <el-option v-for="(value,key) in tradeObj" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          @change="daterangeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.order_sn" placeholder="订单号" clearable class="input-with-select" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="app-container">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="created_at" align="center" label="操作时间" width="100px" />
        <el-table-column min-width="100px" align="center" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.trade_type_id | tradeTypeF }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" align="center" label="交易金额">
          <template slot-scope="scope">
            <span v-if="scope.row.trade_type_id === 14" class="blue">+￥{{ scope.row.trade_money }}</span>
            <span v-else class="red">-￥{{ scope.row.trade_money }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" align="center" label="当前代付余额">
          <template slot-scope="scope">
            <span>￥{{ scope.row.account_money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" min-width="150px" align="center" label="订单编号" />
        <el-table-column prop="trade_note" min-width="200px" align="center" label="交易说明" />
      </el-table>
    </div>

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
import { agentSettle } from "@/api/capitalManageApi.js";

export default {
  name: "PaymentBalance",
  data() {
    return {
      tradeObj: {},
      balanceObj: {},
      timeArray: [],
      form: {
        page: 1,
        trade_type_id: "", //	结算类型：13 代付款转出 14 订单结算存入 15 订单佣金转出
        order_sn: "", //	订单号
        start_time: "", //	开始时间
        end_time: "" // 结束时间
      },
      list: [],
      total: 0,
      per_page: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    daterangeChange(val) {
      const [start = "", end = ""] = val || [];
      this.form.start_time = start;
      this.form.end_time = end;
    },
    handleSearch() {
      // 搜索
      this.form.page = 1;
      this.getList();
    },
    getList() {
      agentSettle(this.form)
        .then(res => {
          const {
            list: { data = [], total = 0, per_page = 0 },
            balance = {},
            trade_type_list = {}
          } = res;
          this.list = data;
          this.total = total;
          this.per_page = per_page;
          this.tradeObj = trade_type_list;
          this.balanceObj = balance;
        })
        .catch(err => {
          console.log(err);
        });
    },
    timeSelect(value) {
      this.form.day = value === this.form.day ? "" : value;
      this.form.page = 1;
      this.getList();
    },
    handlePageChange(val) {
      // 分页器：页码变更
      this.form.page = val;
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss">
.total_bg {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 140px;
  background: #ff7a7a;
  margin-bottom: 25px;
  border-radius: 10px;
  padding-top: 30px;
  box-sizing: border-box;

  .total_li {
    list-style: none;

    > p {
      display: block;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
    }

    > span {
      font-size: 50px;
      color: #fff;
      display: block;
      height: 50px;
      line-height: 50px;
      text-align: center;

      > em {
        font-size: 20px;
        font-weight: normal;
        font-style: normal;
      }
    }
  }
}

.blue {
  color: #0a81f8;
}
.red {
  color: #f00;
}
</style>
