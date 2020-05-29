<template>
  <div class="content_list">
    <div class="base_info">
      您的店铺可发布媒{{ form.type === 1?'体案例':'主传记' }}{{ canPublish }}个，已使用{{ hasPublish }}个，剩余{{ canPublish-hasPublish }}个。升级会员，获取更多数量，<a
        :href="'/tollMarket/marketShop/marketShop?id=1' | prefixUrlF"
      >去升级</a>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-form">
      <el-form-item label="名称" prop="name">
        <el-col :span="8" class="mr_20">
          <el-input v-model="form.name" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="售价" prop="price">
        <el-col :span="8" class="mr_20">
          <el-input v-model="form.price" type="number" clearable />
        </el-col>
        元
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <el-col :span="8" class="mr_20">
          <!--          <single-upload btn="上传主图" :url="form.img" @emitSubmit="uploadImg"/>-->
          <single-upload btn="上传主图" :url="form.img" @emitSubmit="uploadImg" />
        </el-col>
      </el-form-item>
      <el-form-item label="源文件" prop="source_file">
        <el-col :span="8" class="mr_20">
          <upload-file btn="上传源文件" :url="form.source_file" @file="uploadFile" />
        </el-col>
      </el-form-item>
      <el-form-item label="详情介绍" prop="introduce">
        <tinymce v-model="form.introduce" :value="form.introduce" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addReq, editReq, getReq } from '@/api/content/media'
import Tinymce from '@/components/Tinymce/index'
import SingleUpload from '@/components/UploadImages/singleUpload'
import UploadFile from '@/components/UploadImages/uploadFiles'

export default {
  name: 'AddMedia',
  components: { SingleUpload, UploadFile, Tinymce },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('售价不能小于0'))
      } else {
        callback()
      }
    }
    return {
      serviceObj: {},
      form: {
        type: 1, //	是	int	类型：1案例，2传记
        name: '', //	是	string	案例传记名称
        price: '', //	是	string	售价
        img: '', //	是	string	主图
        source_file: '', //	是	string	源文件
        introduce: ''//	是	string	介绍
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'change' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '售价不能为空', trigger: 'change' },
          { validator: validatePrice, trigger: 'change' }
        ],
        img: [
          { required: true, message: '主图不能为空', trigger: 'change' }
        ],
        source_file: [
          { required: true, message: '源文件不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '介绍不能为空', trigger: 'change' }
        ]
      },
      selectId: 0,
      canPublish: 0,
      hasPublish: 0,
      detail: {}
    }
  },
  created() {
    const { id, can = 0, has = 0, type = 1 } = this.$route.query
    this.selectId = id
    this.canPublish = can
    this.hasPublish = has
    this.form.type = +type
    if (id) {
      this.getHttp()
    }
  },
  methods: {
    uploadImg(url) {
      this.form.img = url
    },
    uploadFile(url) {
      this.form.source_file = url
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.canPublish <= this.hasPublish) {
            if(!this.selectId){
              this.$message.warning('您允许发布的数量已用完，请升级店铺会员获取更多数量')
              return
            }
          }
          this.selectId ? this.editHttp() : this.addHttp()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addHttp() {
      addReq(this.form).then(res => {
        this.form.page = 1
        this.$router.push({ path: `/product_manage/${this.form.type === 1 ? 'caseManage' : 'biogManage'}` })
      }).catch((err) => {
        console.log(err)
      })
    },
    editHttp() {
      editReq(this.selectId, this.form).then(res => {
        this.form.page = 1
        this.$router.push({ path: `/product_manage/${this.form.type === 1 ? 'caseManage' : 'biogManage'}` })
      }).catch((err) => {
        console.log(err)
      })
    },
    getHttp() {
      getReq(this.selectId).then(res => {
        const { type = 1, name = '', price = '', img = '', source_file = '', introduce = '' } = res
        // this.detail = res
        this.form = {
          type, //	是	int	类型：1案例，2传记
          name, //	是	string	案例传记名称
          price, //	是	string	售价
          img, //	是	string	主图
          source_file, //	是	string	源文件
          introduce//	是	string	介绍
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .base_info {
    line-height: 32px;
    margin-bottom: 20px;
    text-indent: 100px;

    a {
      color: #1890ff;
    }
  }
</style>
