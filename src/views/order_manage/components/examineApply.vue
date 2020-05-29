<template>
  <el-dialog
    title="查看结算申请"
    :visible.sync="showFlag"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="exmine_wrap">
      <div class="title active">授权委托书：</div>
      <ul class="img_box">
        <li v-for="(item,index) in detailData.auth_img" class="img_li" alt="" :key="index">
          <img v-if="item.indexOf('.pdf') < 0 " class="img" :src="aliyunUrls+item" alt=""/>
        </li>
        <li v-for="(item,index) in detailData.auth_img" class="img_li_a" alt="" :key="index">
          <a class="img_a" v-if="item.indexOf('.pdf') >= 0 " :href="aliyunUrls+item" target="_blank">{{item.substring(item.lastIndexOf('/')+1)}}</a>
        </li>
      </ul>
      <div class="title">授权说明：</div>
      <p class="desc">{{detailData.auth_explain}}</p>
      <div class="title">审核状态：{{detailData.check_status|examineStateF}}<span v-show="detailData.reason">，未通过原因：{{detailData.reason}}</span>
      </div>
      <div class="btn_upload" v-if="detailData.check_status === 2">
        <el-button type="primary" @click="submitForm">编辑</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { aliyunUrl } from '@/utils/common'
import { getSettleApplyInfo } from '@/api/orderManageApi'

export default {
  name: 'ExamineApply',
  props: ['order'],
  data() {
    // const { cat_name = '', head_img = '' } = this.item || {}
    return {
      aliyunUrls: aliyunUrl,
      showFlag: true,
      orderSn: this.order,
      detailData: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submitForm() { // 弹出窗口--添加分类
      const { order_sn, auth_img, auth_explain } = this.detailData
      let params = {
        order_sn,//	是	string	服务订单号
        auth_img,//	是	string	授权委托书，多图逗号分开（图片url）
        auth_explain//	是	string	授权说明
      }
      this.$emit('submit', params)
    },
    handleClose() {
      this.$emit('close')
    },
    getList() {
      getSettleApplyInfo(this.orderSn).then(res => {
        if (res.code === 200) {
          this.detailData = res.data || {}
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

<style scoped lang="scss">
  %m_tb_20 {
    margin: 20px 0;
  }

  .exmine_wrap {
    .title {
      @extend %m_tb_20;

      &.active {
        margin-top: 0;
      }
    }

    .desc {
      @extend %m_tb_20;
    }

    .btn_upload {
      padding-left: 100px;
    }
  }
  .img_box {
    display: flex;
    @extend %m_tb_20;
    padding: 0;
    list-style: none;
    .img_li{
      margin-right: 10px;
      width: 89px;
      height: 75px;
    }
    .img {
      width: 89px;
      height: 75px;
    }
    .img_li_a{
      line-height: 30px;
    }
    .img_a{
      display: block;
      color: #337ab7;
    }
  }

</style>
