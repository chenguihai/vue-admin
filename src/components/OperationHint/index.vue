<template>
  <el-dialog
    :title="title"
    :visible.sync="showFlag"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="400px"
  >
    <span>{{ content }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'OperationHint',
  props: ['title', 'content'],
  data() {
    return {
      showFlag: true
    }
  },
  methods: {
    submitForm() {
      this.$emit('emitSubmit')
    },
    handleClose() {
      this.$emit('emitClose')
    }
  }
}
</script>

<style scoped>

</style>
