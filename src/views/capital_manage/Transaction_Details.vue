<template>
  <div class="content_list headerForm">
    <div class="total_bg">
      <span>
        {{ totalIncome }}
        <em>元</em>
      </span>
      <p>总收入</p>
    </div>
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="结算类型">
        <el-select v-model="form.settle_type" class="w_130" placeholder="全部" clearable>
          <el-option
            v-for="item of settlelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算时间">
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
        <el-input
          v-model="form.settle_project"
          placeholder="项目名称"
          clearable
          class="input-with-select"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.settle_explain"
          placeholder="结算说明"
          clearable
          class="input-with-select"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.order_sn" placeholder="订单号" clearable class="input-with-select" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button-group size="small">
          <el-button
            v-for="(item,index) in timeObject"
            :key="index"
            :type="form.day === item.value ? 'primary':''"
            @click="timeSelect(item.value)"
          >{{ item.label }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <div class="app-container">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="结算时间" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" align="center" label="结算类型">
          <template slot-scope="scope">
            <span>{{ scope.row.settle_type | settleTypeF }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="140px" align="center" label="结算订单号">
          <template slot-scope="scope">
            <span>{{ scope.row.order_sn }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="结算项目">
          <template slot-scope="scope">
            <span>{{ scope.row.settle_project }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="140px" align="center" label="结算金额">
          <template slot-scope="scope">
            <span>{{ scope.row.settle_money }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="180px" align="center" label="平台技术费">
          <template slot-scope="scope">
            <span>-{{ scope.row.platform_tech_fee }}&nbsp;(&nbsp;{{ Math.round(scope.row.platform_tech_fee/scope.row.settle_money*100) }}%&nbsp;)</span>
            <div>扣除服务费免费额度{{ scope.row.used_fee }}</div>
          </template>
        </el-table-column>

        <el-table-column min-width="140px" align="center" label="服务商收入">
          <template slot-scope="scope">
            <span class="blue">+{{ scope.row.provider_income }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" align="center" label="结算说明">
          <template slot-scope="scope">
            <span>{{ scope.row.settle_explain }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="totaldate">
      <span>
        <label>收入合计：</label>
        <em>
          {{ filterIncome }}
          <b>元</b>
        </em>
      </span>
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
import { timeObject } from "@/utils/commonData.js";
import { storeSettle } from "@/api/capitalManageApi.js";

export default {
  name: "ServiceOrder",
  data() {
    return {
      totalIncome: 0,
      timeObject: timeObject,
      settlelist: [
        // 1 服务 2 任务 3 案例 4 传记 5 上刊画面
        {
          value: "",
          label: "全部"
        },
        {
          value: 2,
          label: "任务订单"
        },
        {
          value: 1,
          label: "服务订单"
        },
        {
          value: 3,
          label: "案例订单"
        },
        {
          value: 4,
          label: "传记订单"
        },
        {
          value: 5,
          label: "上刊画面订单"
        }
      ],
      timeArray: [],
      form: {
        page: 1,
        settle_type: "", //	结算类型：1 服务 2 任务 3 案例 4 传记 5 上刊画面
        order_sn: "", //	订单号
        settle_project: "", //	项目名称
        settle_explain: "", //	结算说明
        start_time: "", //	结算时间开始
        end_time: "" //	结算时间结束
      },
      list: [],
      total: 0,
      per_page: 0
    };
  },
  computed: {
    filterIncome() {
      const list = this.list.map(item => +item.provider_income);
      const data = list.reduce(function(total, currentValue) {
        return total + currentValue;
      }, 0);
      return Math.floor(data * 100) / 100;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    daterangeChange(val) {
      const [start = "", end = ""] = val || ["", ""];
      this.form.start_time = start;
      this.form.end_time = end;
    },
    handleSearch() {
      // 搜索
      this.form.page = 1;
      this.getList();
    },
    getList() {
      storeSettle(this.form)
        .then(res => {
          const {
            list: { data = [], total = 0, per_page = 0 },
            total_income = 0
          } = res;
          this.list = data;
          this.total = total;
          this.totalIncome = total_income;
          this.per_page = per_page;
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
.totaldate {
  height: 40px;
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
}

.totaldate span {
  float: right;
  margin-right: 20px;
  height: 40px;

  > label {
    font-weight: normal;
    color: #666;
    font-size: 14px;
  }

  > em {
    color: #f8353b;
    font-size: 20px;
    font-style: normal;

    > b {
      font-size: 14px;
    }
  }
}

.total_bg {
  width: 100%;
  height: 140px;
  background: #ff7a7a;
  margin-bottom: 25px;
  border-radius: 10px;
  padding-top: 30px;
  box-sizing: border-box;

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

.blue {
  color: #0a81f8;
}
</style>
