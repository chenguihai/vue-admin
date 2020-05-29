<template>
  <!--  <div>-->
  <el-upload
    :action="fileAction"
    :name="names"
    :headers="fileHeaders"
    list-type="picture"
    :multiple="false"
    :file-list="fileList"
    :limit="1"
    accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF"
    :on-exceed="handleExceed"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
  >
    <!--      :show-file-list="false"-->
    <el-button size="small" type="primary">{{ btn }}</el-button>
    <slot />
  </el-upload>
  <!--    <el-image v-if="!!form.cover" fit="cover"-->
  <!--              :src="form.cover |completePicture"-->
  <!--              :preview-src-list="form.cover |previewPicture"-->
  <!--              class="imgList">-->
  <!--    </el-image>-->
  <!--  </div>-->
</template>
<script>
import { uploadImageUrl, photoAboveUrl, aliyunUrl, uploadVideoUrl } from '@/utils/common'
import { removeFile } from '@/api/common'
import { getToken } from '@/utils/auth'

export default {
  name: 'SingleUpload',
  props: {
    url: {
      type: String,
      default: ''
    },
    btn: {
      type: String,
      default: '上传图片'
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const imageUrl = this.url ? [{ url: aliyunUrl + this.url }] : []
    const flag = this.type === ''
    return {
      fileAction: flag ? uploadImageUrl : photoAboveUrl,
      fileHeaders: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        cover: this.url
      },
      fileList: imageUrl,
      names: flag ? 'imgs' : 'img',
      selectType: this.type
    }
  },
  watch: {
    url: {
      deep: true,
      handler(val) {
        const imageUrl = this.url ? [{ url: aliyunUrl + val }] : []
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
        if (this.selectType === '') {
          const url = res.data.file
          this.form.cover = url
          this.$emit('emitSubmit', url)
        } else {
          this.$emit('emitSubmit', res.data)
        }
      }
    },
    beforeRemove() {
      const param = {
        rmfile: this.form.cover
      }
      removeFile(param).then(res => {
        this.fileList = []
        this.$emit('emitSubmit', '')
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

