<template>
  <el-dialog title="提示" :visible.sync="showFlag" width="500px" :before-close="handleClose"  :close-on-click-modal="false">
    <el-form
      ref="ruleForm"
      :model="form"
      label-width="100px"
    >
      <el-form-item label="拒绝原因" prop="reasons">
        <el-input v-model="form.reasons"  :rows="4" type="textarea" maxlength="200"/>
      </el-form-item>
      <el-form-item prop="sort">
        <el-button type="danger" @click="submitForm">拒绝</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'RefusalReasons',
  data() {
    return {
      showFlag: true,
      form: {
        reasons: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('emitSubmit', this.form.reasons)
    },
    handleClose() {
      this.$emit('emitClose')
    }
  }
}
</script>

<style scoped>

</style>
