<template>
  <el-upload class="multiple_upload"
             :action="fileAction"
             :name="names"
             :headers="fileHeaders"
             :multiple="false"
             :file-list="fileList"
             :limit="limit"
             :accept="acceptType"
             :on-exceed="handleExceed"
             :before-remove="beforeRemove"
             :on-success="handleUploadSuccess"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
import { uploadImageUrl, photoAboveUrl, aliyunUrl, uploadVideoUrl } from '@/utils/common'
import { removeFile } from '@/api/common'
import { getToken } from '@/utils/auth'

export default {
  name: 'multipleUpload',
  props: {
    url: {
      type: Array,
      default: []
    },
    btn: {
      type: String,
      default: '上传图片'
    },
    type: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 5
    },
    acceptType: {
      type: String,
      default: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF,.pdf'
    }
  },
  data() {
    let imageUrl = []
    if (this.url.length > 0) {
      for (let i = 0; i < this.url.length; i++) {
        imageUrl.push({ url: aliyunUrl + this.url[i], path: this.url[i] })
      }
    }
    return {
      fileAction: uploadImageUrl,
      fileHeaders: { 'Authorization': 'Bearer ' + getToken() },
      fileList: imageUrl,
      names: 'imgs',
      selectType: this.type
    }
  },
  methods: {
    handleUploadSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      if (res.code === 0) {
        this.fileList = []
        this.$message.error(res.data)
      } else {
        const { domain } = res.data
        this.fileList.push({ url: domain + '/' + res.data.file, path: res.data.file, name: file.name })
        this.$emit('emitSubmit', this.fileList)
      }
    },
    beforeRemove(file, fileList) {
      const param = {
        rmfile: file.path
      }
      let data = this.fileList
      for (let i = 0; i < data.length; i++) {
        if (data[i].uid === file.uid) {
          this.fileList.splice(i, 1)
        }
      }
      this.$emit('emitSubmit', this.fileList)
      removeFile(param).then(res => {
      }).catch((err) => {
        console.log(err)
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
<style lang="scss">
  .multiple_upload {
    $w_80: 80px;
    $rate50: 50%;

    .el-upload-list--picture-card .el-upload-list__item {
      width: $w_80;
      height: $w_80;
    }

    .el-upload--picture-card {
      position: relative;
      width: $w_80;
      height: $w_80;
    }

    .el-upload--picture-card i {
      position: absolute;
      left: $rate50;
      top: $rate50;
      transform: translate(-$rate50, -$rate50);
      z-index: 10;
    }
  }
</style>

