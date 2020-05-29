<template>
  <div class="content_list">
    <el-form :inline="true" size="small">
      <el-form-item label="名称">
        <el-input v-model="form.case_name" clearable :placeholder="nameType+'名称'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!--待关联列表  can_case-->
    <div class="transfer">
      <div class="left">
        <p class="title">待关联媒体{{nameType}}列表</p>
        <ul class="left_ul">
          <li
            v-for="(item,index) in canCase"
            :key="item.case_id"
            :class="['left_li',{'active':item.selected}]"
            @click="clickItem(index,'can')"
          >
            {{ item.case_name }}
          </li>
        </ul>
      </div>
      <div class="middle">
        <ul class="middle_ul">
          <li class="middle_li">
            <el-button class="middle_btn" type="primary" @click="addRelation()">加入关联&nbsp;&gt;</el-button>
          </li>
          <li class="middle_li">
            <el-button class="middle_btn" type="primary" @click="addRelation('batch')">批量加入关联&nbsp;&gt;&gt;</el-button>
          </li>
          <li class="middle_li">
            <el-button class="middle_btn" type="primary" @click="cancelRelation()">取消关联&nbsp;&lt;</el-button>
          </li>
          <li class="middle_li">
            <el-button class="middle_btn" type="primary" @click="cancelRelation('batch')">批量取消关联&nbsp;&lt;&lt;
            </el-button>
          </li>
        </ul>
      </div>
      <!--已关联列表  has_case-->
      <div class="left">
        <p class="title">已关联{{nameType}}列表</p>
        <ul class="left_ul">
          <li
            v-for="(item,index) in hasCase"
            :key="item.case_id"
            :class="['left_li',{'active':item.selected}]"
            @click="clickItem(index,'has')"
          >
            {{ item.case_name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { listItem, saveItem } from '@/api/content/service'

export default {
  name: 'MediaCase',
  props: ['type'],
  data() {
    const { id = 0 } = this.$route.query
    return {
      mediaSid: id, //	是	int	服务id
      mediaType: +this.type, //	是	int	类型：1 案例，2 传记
      nameType:this.type ===1?'案例':'传记',
      form: {
        case_name: ''// 否	string	案例传记名称（查询）
      },
      hasCase: [],
      canCase: []
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        console.log(val)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clickItem(index, type = 'can') {
      if (type === 'has') {
        const data = this.hasCase[index]
        data.selected = !data.selected
        this.$set(this.hasCase, index, data)
      } else {
        const data = this.canCase[index]
        data.selected = !data.selected
        this.$set(this.canCase, index, data)
      }
    },
    addRelation(type = '') { // 加入关联
      let ids = []
      if (type === 'batch') {
        ids = this.canCase.map(item => item.case_id)
      } else {
        ids = this.canCase.filter(item => item.selected).map(item => item.case_id)
      }
      if (ids.length === 0 && type !== 'batch') {
        this.$message.warning('至少要选中一项')
        return
      }
      this.saveHttp(ids, 1)
    },
    cancelRelation(type = '') { // 取消关联
      let ids = []
      if (type === 'batch') {
        ids = this.hasCase.map(item => item.case_id)
      } else {
        ids = this.hasCase.filter(item => item.selected).map(item => item.case_id)
      }
      if (ids.length === 0 && type !== 'batch') {
        this.$message.warning('至少要选中一项')
        return
      }
      console.log(ids)
      this.saveHttp(ids)
    },
    clickSearch() {
      this.getList()
    },
    getList(params) {
      listItem(this.mediaSid, this.mediaType, this.form).then(res => {
        const { has_case = [], can_case = [] } = res
        this.hasCase = has_case
        this.canCase = can_case
      }).catch(err => {
        console.log(err)
      })
    },
    saveHttp(ids, status = 2) {
      const param = {
        status, //	是	int	1添加关联，2取消关联
        case_ids: ids//	是	array	需关联的案例传记id
      }
      saveItem(this.mediaSid, this.mediaType, param).then(res => {
        if (res.code == 1) {
          this.getList()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .transfer {
    display: flex;

    ul {
      list-style: none;
      margin: 10px 0;
      font-size: 14px;
    }

    .left {
      width: 384px;
    }

    .title {

    }

    .middle {
      padding: 0 30px;
      display: inline-flex;
      align-items: center;
    }
  }

  .left_ul {
    padding: 20px 10px;
    border: 1px solid #000;
    height: 412px;

    .left_li {
      line-height: 24px;
      cursor: pointer;

      &.active {
        color: #1890ff;
      }
    }
  }

  .middle_ul {
    padding-left: 0;

    .middle_li {
      text-align: center;
    }

    .middle_btn {
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #1890ff;
      border-color: #1890ff;
      margin: 10px;
    }
  }
</style>
