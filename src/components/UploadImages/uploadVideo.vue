<template>
  <el-upload
    v-loading="loading"
    :element-loading-text="percentage"
    :action="fileAction"
    name="video"
    :headers="fileHeaders"
    list-type="text"
    :multiple="false"
    :file-list="fileList"
    :limit="1"
    :show-file-list="false"
    accept=".mp4,.Ogg,.MPEG4,.WebM"
    :on-progress="onProgress"
    :on-exceed="handleExceed"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
  >
    <el-button size="small" type="primary">{{ btn }}</el-button>
    <slot />
    <div v-if="form.cover" class="video_wrap">
      <video :src="form.cover | prefixPicture" controls="controls" class="imgList">
        your browser does not support the video tag
      </video>
      <i class="icon el-icon-error" @click.stop="deleteVideo" />
      <slot name="footer" />
    </div>
    <template v-else>
      <div v-if="loading" class="video_wrap" />
    </template>
  </el-upload>
</template>
<script>
import { uploadVideoUrl, aliyunUrl } from '@/utils/common'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadVideo',
  props: {
    url: {
      type: String,
      default: ''
    },
    btn: {
      type: String,
      default: '上传视频'
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const imageUrl = this.url ? [{ url: aliyunUrl + this.url }] : []
    return {
      fileAction: uploadVideoUrl, // 上传图片地址
      fileHeaders: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        cover: this.url
      },
      fileList: imageUrl,
      dataObj: {},
      loading: null,
      sizeData: 0,
      percentage: 0
    }
  },
  watch: {
    url: {
      deep: true,
      handler(val) {
        this.form.cover = this.url
      }
    }
  },
  methods: {
    onProgress(event, file, fileList) {
      const { size, percentage } = file
      this.sizeData = size
      this.percentage = parseInt(percentage) + '%'
      // this.loading = this.$loading({
      //   lock: true,
      //   text: percent ? percentage + '%' : 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading = true
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.fileList = []
        this.$message.error(res.data)
        this.loading = false
      } else {
        this.dataObj = res.data
        // this.loading.close()
        this.loading = false
        if (this.sizeData / 1024 / 1024 > 300) {
          this.$message.warning('您上传的文件，大小超过限制（300MB），请重新上传。')
          return
        } else if (this.dataObj.duration < 5 || this.dataObj.duration > 300) {
          this.$message.warning('您上传的文件，时间长度不符合限制（5-300秒），请重新上传。')
          return
        }
        this.form.cover = res.data.origin
        this.$emit('emitSubmit', res.data)
      }
    },
    beforeRemove() {
      this.fileList = []
      this.$emit('close')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    deleteVideo() {
      this.fileList = []
      this.$emit('emitSubmit', '')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .video_wrap {
    display: inline-block;
    position: relative;
    padding-top: 10px;
    min-height: 133px;

    .imgList {
      width: 160px;
      height: 90px;
      overflow: hidden;
    }

    .icon {
      position: absolute;
      top: 0;
      right: -7px;
      z-index: 10;
    }
  }
</style>
