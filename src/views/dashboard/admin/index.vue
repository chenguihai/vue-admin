<template>
  <div class="main_info">
    <ul v-if="false" class="datalist">
      <li>
        <div class="wenben">
          <span>今日收入</span>
        </div>
        <div class="money_text">
          <span class="texter">
            <b>{{ today.income }}</b>
            <em>元</em>
          </span>
        </div>
      </li>
      <li>
        <span class="wenben">今日服务订单数</span>
        <div class="money_text">
          <span class="texter ordernum">
            <b>{{ today.service_num }}</b>
            <em>笔</em>
          </span>
        </div>
      </li>
      <li>
        <span class="wenben">今日购买线索数</span>
        <div class="money_text">
          <span class="texter clue">
            <b>{{ today.clue_num }}</b>
            <em>个</em>
          </span>
        </div>
      </li>

      <li>
        <span class="wenben">今日退款笔数</span>
        <div class="money_text">
          <span class="texter refuse">
            <b>{{ today.service_refund }}</b>
            <em>笔</em>
          </span>
        </div>
      </li>
    </ul>
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24">
        <el-card class="box-card">
          <ul class="boxUl">
            <li class="itemLi">
              <div class="title">今日收入</div>
              <strong class="num">{{ today.income }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日服务订单数</div>
              <strong class="num">{{ today.service_num }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日购买线索数</div>
              <strong class="num">{{ today.clue_num }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日退款笔数</div>
              <strong class="num">{{ today.service_refund }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日媒体案例订单数</div>
              <strong class="num">{{ today.case_num }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日媒主传记订单数</div>
              <strong class="num">{{ today.biog_num }}</strong>
            </li>
            <li class="itemLi">
              <div class="title">今日上刊画面订单数</div>
              <strong class="num">{{ today.journal_num }}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-if="storeProduct.title" :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header">
            <span
              v-for="(item,index) in storeProduct.title"
              :key="index"
              :class="['card_title',{'active':productIndex===index}]"
              @click="clickNav('product',index)"
            >{{ item }}</span>
          </div>
          <pie-chart :chartdata="productList" :chartname="productTitle"/>
        </el-card>
      </el-col>
      <el-col v-if="storeOrder.title" :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header">
            <span
              v-for="(item,index) in storeOrder.title"
              :key="index"
              :class="['card_title',{'active':orderIndex===index}]"
              @click="clickNav('order',index)"
            >{{ item }}</span>
          </div>
          <pie-chart :chartdata="orderList" :chartname="orderTitle"/>
        </el-card>
      </el-col>
      <el-col v-if="storeClue.title" :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header">
            <span
              v-for="(item,index) in storeClue.title"
              :key="index"
              :class="['card_title',{'active':clueIndex===index}]"
              @click="clickNav('clue',index)"
            >{{ item }}</span>
          </div>
          <pie-chart :chartdata="clueList" :chartname="clueTitle"/>
        </el-card>
      </el-col>
    </el-row>
    <ul class="trend">
      <li>
        <div class="titles">
          <span>店铺收入趋势</span>
          <div style="float:right">
            <el-date-picker
              v-model="timeArray"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:220px"
              placeholder="选择日期"
              @change="timeChange"
            />
          </div>
        </div>
        <line-chart :chart-data="storeIncome"/>
      </li>
      <li>
        <div class="titles">
          <span>店铺交易趋势</span>
          <div style="float:right">
            <el-date-picker
              v-model="datePick"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:220px"
              placeholder="选择日期"
              @change="orderTimeChange"
            />
          </div>
        </div>
        <line-chart :chart-data="storeTrade"/>
      </li>
    </ul>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import { storeIndex, selectTime } from '@/api/homePageApi.js'

export default {
  name: 'DashboardAdmin',
  components: { LineChart, PieChart },
  data() {
    return {
      today: {},
      timeArray: '',
      datePick: '',
      storeIncome: {},
      storeTrade: {},

      storeProduct: {}, //
      productIndex: 0,
      productList: [],
      productTitle: [],
      storeOrder: {}, //
      orderIndex: 0,
      orderList: [],
      orderTitle: [],
      storeClue: {}, //
      clueIndex: 0,
      clueList: [],
      clueTitle: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clickNav(type, index) {
      if (type === 'product') {
        if (this.productIndex === index) {
          return
        }
        const { data = [] } = this.storeProduct
        this.productIndex = index
        this.productTitle = data[index].map(item => item.name)
        this.productList = data[index]
      } else if (type === 'order') {
        if (this.orderIndex === index) {
          return
        }
        const { data = [] } = this.storeOrder
        this.orderIndex = index
        this.orderTitle = data[index].map(item => item.name)
        this.orderList = data[index]
      } else {
        if (this.clueIndex === index) {
          return
        }
        const { data = [] } = this.storeClue
        this.clueIndex = index
        this.clueTitle = data[index].map(item => item.name)
        this.clueList = data[index]
      }
    },
    timeChange(value) {
      this.selectTimeHttp(1, value)
    },
    orderTimeChange(value) {
      this.selectTimeHttp(2, value)
    },
    getList() {
      storeIndex().then(res => {
        const { date_7 = [], store_income = {}, store_trade = {}, today = {}, store_product = {}, store_order = {}, store_clue = {} } = res
        this.storeIncome = { ...store_income, date_7: date_7 }
        this.storeTrade = { ...store_trade, date_7: date_7 }
        this.today = today
        this.storeProduct = store_product
        this.storeOrder = store_order
        this.storeClue = store_clue

        this.productList = store_product.data[0]
        this.productTitle = store_product.data[0].map(item => item.name)
        this.orderList = store_order.data[0]
        this.orderTitle = store_order.data[0].map(item => item.name)
        this.clueList = store_clue.data[0]
        this.clueTitle = store_clue.data[0].map(item => item.name)
      }).catch(err => {
        console.log(err)
      })
    },
    selectTimeHttp(type, ymd) { // type=1,店铺收入；type=2, 店铺交易 //	查询开始时间：如 “2019-09-27”
      selectTime(type, ymd).then(res => {
        if (type === 1) {
          this.storeIncome = { ...this.storeIncome, ...res }
        } else {
          this.storeTrade = { ...this.storeTrade, ...res }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  .box-card {
    margin-bottom: 20px;
  }

  .card_title {
    margin-right: 20px;
    cursor: pointer;

    &.active {
      color: #0a81f8;
    }
  }

  .money_text {
    margin: 15px auto 0 auto;
    width: 200px;
    text-align: left;
    height: 40px;
    line-height: 40px;
  }

  .money_text span.texter {
    font-size: 36px;
    color: #ff0027;

    b {
      float: left;
    }
  }

  .money_text span.texter.ordernum {
    color: #0a81f8;
  }

  .money_text span.texter.clue {
    color: #ffa406;
  }

  .money_text span.texter.refuse {
    color: #ff746f;
  }

  .money_text em {
    font-size: 18px;
    font-style: normal;
    margin-left: 5px;
  }

  .wenben {
    width: 200px;
    text-align: left;
    margin: 0 auto;
    display: block;
  }

  .titles {
    height: 19px;
    line-height: 19px;
    width: 100%;
  }

  .trend {
    width: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;

    li {
      padding: 20px;
      background-color: #fff;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }

    .names {
      height: 19px;
      line-height: 19px;
      display: block;
      margin-bottom: 19px;
      float: left;
    }
  }

  .main_info {
    padding: 20px;
    margin: 0;
    overflow: hidden;
    box-sizing: border-box;
  }

  .datalist {
    width: 100%;
    overflow: hidden;
    background: #fff;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .datalist li {
    width: 25%;
    list-style-type: none;
    float: left;
    height: 130px;
    position: relative;
    box-sizing: border-box;
    padding: 20px 31px;
    margin-right: 1.33%;
    margin: 15px 0;
  }

  .datalist li:not(:last-child) {
    border-right: 1px solid #ddd;
  }

  .datalist li span {
    font-size: 18px;
    color: #999;
  }

  /*新的*/
  .box-card {
    margin-bottom: 20px;
  }

  .boxUl {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;

    .itemLi, .itemLi3 {
      text-align: center;
      margin-bottom: 10px;
    }

    .itemLi {
      width: 25%;
    }

    .itemLi3 {
      width: 33.33%;
    }

    .title {
      margin: 20px 0;
      font-size: 14px;
    }

    .num {
      display: block;
      font-size: 28px;
    }
  }
</style>
