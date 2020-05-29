<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <el-form-item label="服务详情" prop="pc">
      <tinymce v-model="form.pc" :value="form.pc" />
    </el-form-item>
    <el-form-item label="相关案例介绍">
      <tinymce v-model="form.case" :value="form.case" />
    </el-form-item>
    <el-form-item label="相关传记介绍">
      <tinymce v-model="form.biography" :value="form.biography" />
    </el-form-item>
    <el-form-item label="关键词">
      <el-input v-model="form.keywords" clearable />
      <p class="help-block">用于搜索引擎搜索，多个请用‘&nbsp;|&nbsp;’隔开</p>
    </el-form-item>
    <el-form-item label="简单描述">
      <el-input v-model="form.desc" type="textarea" />
      <p class="help-block">用于搜索引擎搜索</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import { detailsedit, getEditBaseInfo } from '@/api/service.js'
import { messageCommon } from '@/utils/common.js'

export default {
  name: 'DetailsList',
  components: { Tinymce },
  data() {
    return {
      pcDetails: '',
      caseIntro: '',
      biographyIntro: '',
      form: {
        action: 2,	// 是integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性
        id: 0, //	是	integer	服务id
        pc: '', //	是	string	服务详情
        case: '', //	是	string	相关案例介绍
        biography: '', //	是	string	相关传记介绍
        keywords: '', //	是	string	关键词
        desc: ''//	是	string	简单描述
      },
      rules: {
        pc: [
          { required: true, message: '服务pc详情不能为空', trigger: 'change' }
        ]
        // case: [
        //   { required: true, message: '相关案例介绍不能为空', trigger: 'change' }
        // ],
        // biography: [
        //   { required: true, message: '相关传记介绍不能为空', trigger: 'change' }
        // ],
        // keywords: [
        //   { required: true, message: '关键词不能为空', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '简单描述不能为空', trigger: 'change' }
        // ]
      }
    }
  },
  created() {
    const { id = 0 } = this.$route.query
    if (id) {
      this.form.id = +id
      this.getEditBaseInfoHttp()
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailIntroduceHttp()
        } else {
          return false
        }
      })
    },
    detailIntroduceHttp() {
      // this.form.pc = tinyMCE.editors[0].getContent()
      // this.form.case = tinyMCE.editors[1].getContent()
      // this.form.biography = tinyMCE.editors[2].getContent()
      detailsedit(this.form).then(res => {
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
    getEditBaseInfoHttp() {
      const { id, action } = this.form
      const params = {
        id, action // 1基础信息,2详细介绍,3图库,4规格属性
      }
      getEditBaseInfo(params).then(res => {
        if (res.code === 200) {
          const { pc = '', biography = '', keywords = '', desc = '', case: cases = '' } = res.data.service_info
          this.form = { ...this.form, pc, biography, case: cases, keywords, desc }
        } else {
          messageCommon(this, res.message, 'error')
        }
      }).catch(err => {
        console.log(err)
      }
      )
    }
  }
}
</script>

<style scoped lang="scss">
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
