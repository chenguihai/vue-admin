<template>
  <el-upload
    class="upload-demo"
    :action="fileAction"
    :headers="fileHeaders"
    name="imgs"
    :multiple="multiples"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :file-list="fileList"
    :show-file-list="false"
    accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF"
    :on-success="handleSuccess"
  >
    <el-button type="primary" size="small">{{ btnName }}</el-button>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import { uploadImageUrl } from '@/utils/common'

export default {
  name: 'UploadImages',
  props: ['btnName', 'multiple'],
  data() {
    return {
      multiples: this.multiple || false,
      fileAction: uploadImageUrl, // 上传图片地址
      fileHeaders: { 'Authorization': 'Bearer' + getToken() }, // 以上是属性
      src: '',
      fileList: []
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      // const { domain, file } = res.data
      // console.log(res, file)
      // this.src = res.data.domain + '/' + res.data.file
      // this.fileList = file
      if (res.code === 0) {
        this.fileList = []
        this.$message.error(res.data)
      } else {
        this.$emit('emitSubmit', res.data.file)
      }
    },
    beforeRemove() {
      // 图片上传前
    },
    handleRemove() {
      // 图片删除
      // this.fileList = []
      // this.$emit('emitSubmit', '')
    },
    handlePreview() {
      // 图片查看
    }
  }
}
</script>

<style scoped>

</style>
