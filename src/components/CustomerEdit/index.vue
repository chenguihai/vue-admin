<template>
  <el-dialog
    :title="title"
    :visible.sync="showFlag"
    width="400px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="客服名称" prop="kf_name">
        <el-input v-model="form.kf_name" />
      </el-form-item>
      <el-form-item label="客服QQ号码" prop="kf_account">
        <el-input v-model="form.kf_account" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomerEdit',
  props: ['title', 'listItem'],
  data() {
    const { kf_name = '', kf_account = '' } = this.listItem
    return {
      showFlag: true,
      form: {
        kf_name: kf_name, //	是	string	客服名称
        kf_account: kf_account//	是	string	客服账号
      },
      rules: {
        kf_name: [
          { required: true, message: '客服名称不能为空', trigger: 'change' }
        ],
        kf_account: [
          { required: true, message: '客服QQ号码不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) { // 修改 订单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('emitSubmit', this.form)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('emitClose')
    }
  }
}
</script>

<style scoped>

</style>
