<template>
  <div class="content_list">
    <el-form ref="form" :model="form" :rules="rules" label-width="170px">
      <el-form-item label="店铺名称" prop="store_name">
        <el-col :xs="24" :md="12">
          <el-input v-model="form.store_name" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="店铺LOGO" prop="logo">
        <el-col :xs="24" :lg="12">
          <upload-images btn-name="上传店铺LOGO" @emitSubmit="handleLogoUpload" />
          <p class="help-block">建议图片尺寸：长高比
            <em>1:1</em></p>
          <img :src="form.logo | prefixPicture" class="imgLogo">
        </el-col>
      </el-form-item>
      <el-form-item label="店铺头部自定义" prop="head_img">
        <el-col :xs="24">
          <upload-images btn-name="上传头部图片" @emitSubmit="handleImageUpload" />
          <p class="help-block">
            建议图片尺寸：长<em>1920px*130px</em>。店铺头部即店铺信息与导航栏之间的区域
          </p>
          <img :src="form.head_img | prefixPicture" class="imglist">
        </el-col>
      </el-form-item>
      <el-form-item label="店铺首页内容区自定义" prop="custom_setting">
        <tinymce v-model="form.custom_setting" :value="form.custom_setting" />
        <p class="help-block"> 建议图片尺寸：长<em>1920px</em>，高度不限。店铺首页内容区即导航栏与热门推荐之间的区域</p>
      </el-form-item>
      <el-form-item label="店铺关键词" prop="keywords">
        <el-col :xs="24" :md="12">
          <el-input v-model="form.keywords" />
          <p class="help-block">用于搜索引擎搜索，多个请用‘&nbsp;|&nbsp;’隔开</p>
        </el-col>
      </el-form-item>
      <el-form-item label="店铺描述" prop="description">
        <el-col :xs="24" :md="12">
          <el-input v-model="form.description" type="textarea" />
          <p class="help-block">用于搜索引擎搜索</p>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import UploadImages from '@/components/UploadImages'
import { aliyunUrl, messageCommon } from '@/utils/common.js'
import { storeSetting, storeInfo } from '@/api/storeInfoSetApi'

export default {
  name: 'ShopManageSet',
  components: { Tinymce, UploadImages },
  data() {
    var validateStoreName = (rule, value, callback) => {
      if (/公司|旗舰/.test(value)) {
        if (this.shopInfo.type_id === 2) {
          callback()
        } else {
          callback(new Error('个人店铺名称不能包含公司，旗舰等字'))
        }
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      fileLister: [],
      prefixUrl: aliyunUrl,
      shopInfo: {},
      form: {
        store_name: '', //	是	string	店铺名称
        logo: '', //	是	string	店铺LOGO url
        head_img: '', //	是	string	店铺头部自定义图片url
        custom_setting: '', //	是	text	店铺首页自定义内容
        keywords: '', //	否	string	店铺关键字
        description: ''//	否	string	店铺描述
      },
      rules: {
        store_name: [
          { required: true, message: '店铺名称不能为空', trigger: 'change' },
          { validator: validateStoreName, trigger: 'change' }
        ],
        logo: [
          { required: true, message: '店铺LOGO不能为空', trigger: 'change' }
        ],
        head_img: [
          { required: true, message: '店铺头部自定义不能为空', trigger: 'change' }
        ],
        custom_setting: [
          { required: true, message: '店铺首页内容区自定义不能为空', trigger: 'change' }
        ],
        keywords: [
          { required: true, message: '店铺关键词不能为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '店铺描述不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const shopInfo = localStorage.getItem('shopInfo')
    if (shopInfo) {
      this.shopInfo = JSON.parse(shopInfo)
    }
    this.storeInfoFun()
  },
  methods: {
    handleLogoUpload(src) {
      this.form.logo = src
    },
    handleImageUpload(src) {
      this.form.head_img = src
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.storeSettingFun()
        } else {
          return false
        }
      })
    },
    storeSettingFun() {
      const data = JSON.parse(JSON.stringify(this.form))
      delete data.user_id
      delete data.id
      storeSetting(data).then(res => {
        if (res.code === 200) {
          this.storeInfoFun()
          messageCommon(this, '操作成功')
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    storeInfoFun() {
      storeInfo(this.form).then(res => {
        if (res.code === 200) {
          this.form = res.data
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .imgLogo {
    display: block;
    width: 260px;
  }

  .imglist {
    display: block;
    background: #ddd;
    width: auto;
    max-width: 100%;
  }

  /*p.help-block em {*/
  /*  font-style: normal;*/
  /*  color: #1d79e2;*/
  /*}*/

  /*p.help-block {*/
  /*  margin: 0;*/
  /*  height: 20px;*/
  /*  line-height: 20px;*/
  /*  font-size: 12px;*/
  /*  color: #999;*/
  /*}*/
</style>
