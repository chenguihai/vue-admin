<template>
  <el-dialog
    title="修改订单"
    width="500px"
    :visible.sync="showFlag"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <!--        @submit.native.prevent-->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="订单金额" prop="amount">
        <el-col :span="18">
          <el-input v-model="form.amount" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="18">
          <el-button type="danger" @click="submitForm('form')">确认修改</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditOrderPrice',
  data() {
    return {
      showFlag: true,
      form: {
        amount: ''
      },
      rules: {
        amount: [
          { required: true, message: '价格不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) { // 修改 订单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const num = new Number(this.form.amount).toFixed(2)
          this.$emit('emitOrderPrice', num)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('emitCloseDialog')
    }
  }
}
</script>

<style scoped>

</style>
