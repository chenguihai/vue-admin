<template>
  <el-upload
    :action="fileAction"
    name="case"
    :headers="fileHeaders"
    :multiple="false"
    :file-list="fileList"
    :limit="1"
    accept=".doc,.docx,.ppt,.pptx,.pdf"
    :on-exceed="handleExceed"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
  >
    <el-button size="small" type="primary">{{ this.btn }}</el-button>
    <slot />
  </el-upload>
</template>
<script>
import { uploadFileUrl, aliyunUrl } from '@/utils/common'
import { getToken } from '@/utils/auth'
import { removeFile } from '@/api/common'

export default {
  name: 'UploadFiles',
  props: ['url', 'btn'],
  data() {
    const imageUrl = this.url ? [{ url: aliyunUrl + this.url }] : []
    return {
      fileAction: uploadFileUrl,
      fileHeaders: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        cover: this.url
      },
      fileList: imageUrl
    }
  },
  watch: {
    url: {
      deep: true,
      handler(val) {
        let name = ''
        if (val) {
          const index = val.lastIndexOf('/')
          name = val.substring(index + 1).replace(/_[0-9]{4}\./, '.')
        }
        const imageUrl = this.url ? [{ name: name, url: aliyunUrl + val }] : []
        this.fileList = imageUrl
      }
    }
  },
  methods: {
    handleUploadSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.fileList = []
        this.$message.error(res.data)
      } else {
        const url = res.data
        this.form.cover = url
        this.$emit('file', url)
      }
    },
    beforeRemove() {
      const param = {
        rmfile: this.form.cover
      }
      removeFile(param).then(res => {
        this.fileList = []
        this.$emit('file', '')
      }).catch((err) => {
        console.log(err)
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .imgList {
    width: 160px;
    height: 90px;
    overflow: hidden;
    margin-top: 10px;
  }
</style>

