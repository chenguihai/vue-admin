<template>
  <el-dialog
    title="结算申请"
    :visible.sync="showFlag"
    width="700px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="授权委托书" prop="auth_img">
        <multiple-upload btn="上传授权委托书" :url="form.auth_img" @emitSubmit="uploadFile"/>
        <div class="settle-block">授权委托书是您委托凌天众媒代付的书面申请，请下载模板填写内容签字后上传。</div>
        <div class="settle-block"><a class="settle_link"
                                     href="http://ltzm1.oss-cn-shenzhen.aliyuncs.com/uploads/file/凌天众媒网代付授权委托协议.doc">下载官方授权委托书模板</a>
        </div>
      </el-form-item>
      <el-form-item label="授权说明" prop="auth_explain">
        <el-input
          v-model="form.auth_explain"
          type="textarea"
          maxlength="250"
          :autosize="{ minRows: 4,maxRows: 6}"
          show-word-limit
          placeholder="请详细说明合同签署相关的内容，如合同金额、付款详细、各种时间要求"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import MultipleUpload from '@/components/UploadImages/multipleUpload'

export default {
  name: 'SettleApply',
  components: { MultipleUpload },
  props: ['item'],
  data() {
    const { order_sn = '', auth_img = [], auth_explain = '' } = this.item || {}
    return {
      showFlag: true,
      form: {
        order_sn,//	是	string	服务订单号
        auth_img,//	是	string	授权委托书，多图逗号分开（图片url）
        auth_explain//	是	string	授权说明
      },
      rules: {
        auth_img: [{ required: true, message: '授权委托书不能为空', trigger: 'change' }],
        auth_explain: [{ required: true, message: '授权说明不能为空', trigger: 'change' },
          { min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'change' }]
      }
    }
  },
  methods: {
    uploadFile(url) {
      this.form.auth_img = url
    },
    submitForm(formName) { // 弹出窗口--添加分类
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form))
          data.auth_img = data.auth_img.map(item => item.path).join(',')
          this.$emit('submit', data)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .settle-block {
    .settle_link {
      color: #0a81f8;
    }
  }
</style>

