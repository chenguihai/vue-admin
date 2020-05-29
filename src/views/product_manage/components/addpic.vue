<template>
  <div>
    <div v-if="picData.length <10">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="fileAction"
        :headers="fileHeaders"
        name="imgs"
        :multiple="true"
        :limit="uploadNum"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :on-error="handleError"
        :file-list="fileList"
        list-type="picture"
        accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF"
        :on-success="handleUploadImages"
        :auto-upload="false"
      >
        <el-button slot="trigger" type="primary">选择图片</el-button>
        <span class="hint_text">一次性最多上传五张图片</span>
      </el-upload>
      <div class="btn_upload">
        <el-button type="primary" @click="submitUpload">开始上传</el-button>
        <el-button @click="handleCancel">全部取消</el-button>
      </div>
    </div>
    <ul class="imgBox">
      <li v-for="(item,index) in picData" :key="index" class="pr">
        <!--        <img-->
        <!--          :src="item.url | completePicture"-->
        <!--          class="imgList"-->
        <!--          @click="selectImg(index)"-->
        <!--        >-->
        <div
          class="imgList"
          :style="{backgroundImage: 'url('+(aliyunUrls+item.url)+')'}"
          @click="selectImg(index)"
        >
          <i class="el-icon-delete selectImg"/>
          <!--          <svg-icon icon-class="el-icon-delete selectImg"/>-->

        </div>
        <el-input-number
          v-model="item.sort"
          class="num"
          placeholder="显示顺序"
          controls-position="right"
          :min="0"
        />
      </li>
    </ul>
    <div class="btn_upload">
      <el-button size="small" type="primary" @click="submitPageSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { messageCommon, uploadImageUrl, aliyunUrl } from '@/utils/common'
import { getEditBaseInfo, baseInfoEdit } from '@/api/service.js'

export default {
  name: 'Addpic',
  data() {
    return {
      fileAction: uploadImageUrl, // 上传图片地址
      aliyunUrls: aliyunUrl,
      fileHeaders: { 'Authorization': 'Bearer' + getToken() },
      fileList: [],
      picData: [],
      oldPicData: [],
      uploadNum: 5,
      form: {
        action: 3, //	是	integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性
        id: 0, //	是	integer	服务id
        pic: []//	是	string	图片路径，多个逗号隔开uploads/images/201909/03/201909031021073155.jpg
      }
    }
  },
  created() {
    const id = +(this.$route.query.id || 0)
    if (id) {
      this.form.id = id
      this.getEditBaseInfoHttp()
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // 图片删除
      var imgurls = file.url
      this.fileList.forEach((val, index) => {
        if (val.url === imgurls) {
          this.fileList.splice(index, 1)
        }
      })
    },
    handleError(file) {
      console.log(file)
    },
    handleChange(file, fileList) { // 文件状态改变时的钩子
      this.fileList = fileList
    },
    handleUploadImages(res, file, fileList) {
      console.log(res, file, fileList)
      if (res.code === 1) {
        const data = []
        data.push({
          url: res.data.file,
          sort: 0,
          checked: false
        })
        this.picData = this.picData.concat(data)
        this.uploadNum = this.picData.length > 5 ? 5 - this.picData.length % 5 : 5
      } else {
        this.$message.error(res.data)
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    submitPageSave() {
      this.baseInfoEditHttp()
    },
    baseInfoEditHttp() {
      // if (this.oldPicData.length this.picData.length) {
      //   return
      // }
      const params = { ...this.form, pic: this.picData.length > 0 ? JSON.stringify(this.picData) : '' }
      baseInfoEdit(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '保存成功')
          this.$router.push({
            path: '/product_manage/service_manage'
          })
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectImg(index) {
      this.picData.splice(index, 1)
    },
    handleCancel() {
      if (this.fileList.length === 0) {
        return
      }
      this.fileList = []
    },
    getEditBaseInfoHttp() {
      const { id, action } = this.form
      const params = {
        id: id,
        action: action // 1基础信息,2详细介绍,3图库,4规格属性
      }
      getEditBaseInfo(params).then(res => {
        const data = res.data.service_images
        for (let i = 0; i < data.length; i++) {
          data[i].checked = false
        }
        this.picData = data
        this.oldPicData = data
        this.uploadNum = this.picData.length > 5 ? 5 - data.length % 5 : 5
      }).catch(err => {
          console.log(err)
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">

  .btn_upload {
    width: 100%;
    text-align: center;
    margin: 20px auto;
  }

  .pr {
    position: relative;
  }

  .num {
    width: 100px;
  }

  li {
    list-style: none;
  }

  .imgBox {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;

    li {
      margin: 0 10px 10px;
      text-align: center;
      width: 210;
      overflow: hidden;
      cursor: pointer;
    }

    .selectImg {
      display: none;
      position: absolute;
      z-index: 10;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      color: red;
    }

    .imgList {
      width: 210px;
      height: 118px;
      display: block;
      background: #ddd;
      margin-bottom: 10px;
      background: no-repeat center;
      background-size: cover;
      position: relative;

      &:hover {
        .selectImg {
          display: block;
        }
      }
    }

  }

  .hint_text {
    padding-left: 10px;
    color: red;
    font-size: 12px;
  }
</style>
