<template>
  <div class="content_list">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="示例名称" prop="case_name">
        <el-col :xs="24" :md="12" :lg="8">
          <el-input v-model="form.case_name" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="示例分类" prop="cate_id">
        <el-col :xs="24" :md="12" :lg="8">
          <el-cascader
            v-model="form.cate_id"
            :style="{width:'100%'}"
            :options="categoryList"
            :props="optionProps"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="客户名称" prop="customer_name">
        <el-col :xs="24" :md="12" :lg="8">
          <el-input v-model="form.customer_name" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="客户所在领域" prop="realm_id">
        <el-col :xs="24" :md="12" :lg="8">
          <el-select v-model="form.realm_id" clearable placeholder="选择领域">
            <el-option v-for="item in realmList" :label="item.sr_name" :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="合作费用" prop="price">
        <el-col :xs="24" :md="12" :lg="8">
          <el-input v-model="form.price" clearable />
        </el-col>
        <el-col class="line" :span="2">&nbsp;&nbsp;元</el-col>
      </el-form-item>
      <el-form-item label="合作示例主图" prop="image_url">
        <el-col :xs="24" :md="12" :lg="8">
          <upload-images btn-name="上传图片" @emitSubmit="handleImageUpload" />
          <p class="help-block">
            用于列表展示，建议尺寸长高比<em>5:3</em>
          </p>
          <img :src="form.image_url | prefixPicture" class="imglist">
        </el-col>
      </el-form-item>
      <el-form-item label="合作示例详情介绍" prop="desc">
        <tinymce v-model="form.desc" :value="form.desc" />
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
import { getRealm, getCaseInfo, caseAdd, caseEditById, getCategory } from '@/api/customerExampleApi'
import { messageCommon } from '@/utils/common.js'

export default {
  name: 'Newcooperation',
  components: { Tinymce, UploadImages },
  data() {
    return {
      optionProps: {
        value: 'id',
        label: 'cate_name',
        children: 'children'
      },
      itemId: 0,
      detailData: {},
      realmList: [],
      categoryList: [],
      form: {
        case_name: '', //	是	string	客户合作示例名称
        cate_id: [], //	是	string	分类id 一级,二级,三级 逗号隔开(1,2,3)
        customer_name: '', //	是	string	客户名称
        realm_id: '', //	是	int	领域id
        price: '', //	是	decimal(11,2)	价格，两位小数
        image_url: '', //	是	string	合作示例主图url
        desc: ''//	是	text	合作示例详情
      },
      rules: {
        case_name: [
          { required: true, message: '示例名称不能为空', trigger: 'change' }
        ],
        cate_id: [
          { required: true, message: '示例分类不能为空', trigger: 'change' }
        ],
        customer_name: [
          { required: true, message: '客户名称不能为空', trigger: 'change' }
        ],
        realm_id: [
          { required: true, message: '客户所在领域不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '合作费用不能为空', trigger: 'change' }
        ],
        image_url: [
          { required: true, message: '合作示例主图不能为空', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '合作示例详情介绍不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const { id = '' } = this.$route.query
    this.itemId = id
    if (id) {
      this.getCaseInfoFun()
    }
    this.getRealmFun()
    this.getCategoryHttp()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          params.cate_id = params.cate_id.pop()
          if (this.itemId) {
            this.caseEditByIdFun(params)
          } else {
            this.caseAddFun(params)
          }
        } else {
          return false
        }
      })
    },
    handleImageUpload(src) {
      this.form.image_url = src
    },
    getRealmFun() {
      getRealm().then(res => {
        if (res.code === 200) {
          this.realmList = res.data
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCategoryHttp() {
      getCategory().then(res => {
        if (res.code === 200) {
          this.categoryList = res.data
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCaseInfoFun() {
      getCaseInfo(this.itemId).then(res => {
        if (res.code === 200) {
          this.detailData = res.data
          const { case_name, case_cate, customer_name, realm_id, price, image_url, desc } = res.data
          this.form = {
            case_name, //	是	string	客户合作示例名称
            cate_id: case_cate.split(',').map(item => item = +item), //	是	string	分类id 一级,二级,三级 逗号隔开(1,2,3)
            customer_name, //	是	string	客户名称
            realm_id, //	是	int	领域id
            price, //	是	decimal(11,2)	价格，两位小数
            image_url, //	是	string	合作示例主图url
            desc//	是	text	合作示例详情
          }
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    caseEditByIdFun(params) {
      caseEditById(params, this.itemId).then(res => {
        if (res.code === 200) {
          messageCommon(this, '编辑成功')
          this.jumpListPage()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    caseAddFun(params) {
      caseAdd(params).then(res => {
        if (res.code === 200) {
          messageCommon(this, '添加成功')
          this.jumpListPage()
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    jumpListPage() {
      this.$router.push({
        path: '/product_manage/cooperation_case'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .imglist {
    height: 150px;
    display: block;
    background: #ddd;
  }

  /*p.help-block {*/
  /*  margin: 0;*/
  /*  height: 20px;*/
  /*  line-height: 20px;*/
  /*  font-size: 12px;*/
  /*  color: #999;*/

  /*  em {*/
  /*    font-style: normal;*/
  /*    color: #1d79e2;*/
  /*  }*/
  /*}*/
</style>
