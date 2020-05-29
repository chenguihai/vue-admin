<template>
  <el-dialog
    :title="title"
    :visible.sync="showFlag"
    width="600px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="form.cat_name" clearable maxlength="100" autosize />
      </el-form-item>
      <el-form-item label="排序值" prop="sort_order">
        <el-input-number v-model="form.sort_order" type="number" :min="1" controls-position="right" clearable />
        <p class="help-block">用于控制分类的显示顺序，值越小越靠前。</p>
      </el-form-item>
      <el-form-item label="分类关键词" prop="keywords">
        <el-input
          v-model="form.keywords"
          type="textarea"
          maxlength="250"
          :autosize="{ minRows: 2,maxRows: 4}"
          show-word-limit
        />
        <p class="help-block">用于搜索引擎搜索，多个请用‘&nbsp;|&nbsp;’隔开</p>
      </el-form-item>

      <el-form-item label="分类描述" prop="cat_desc">
        <el-input
          v-model="form.cat_desc"
          type="textarea"
          maxlength="250"
          :autosize="{ minRows: 2,maxRows: 4}"
          show-word-limit
        />
        <!--        <p class="help-block">用于搜索引擎搜索</p>-->
      </el-form-item>

      <el-form-item label="是否启用" prop="is_show">
        <el-radio-group v-model="form.is_show">
          <el-radio v-for="(item,index) in ['不启用','启用']" :key="index" :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button v-if="type==='0'" type="primary" @click="submitForm('form')">添加</el-button>
        <el-button v-else-if="type==='1'" type="primary" @click="editForm('form')">修改</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'StoreClass',
  props: ['item', 'type'],
  data() {
    const { cat_id = 0, cat_name = '', keywords = '', cat_desc = '', sort_order = 1, is_show = 1 } = this.item || {}
    var validateKeyword = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!(value.length >= 4 && value.length <= 250)) {
        callback(new Error('分类关键词4-250个字'))
      } else {
        callback()
      }
    }
    var validateDesc = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!(value.length >= 4 && value.length <= 250)) {
        callback(new Error('分类描述4-250个字'))
      } else {
        callback()
      }
    }
    return {
      showFlag: true,
      title: keywords ? '编辑店铺分类' : '添加店铺分类',
      form: {
        id: cat_id, //	是	int	类目id，url参数
        cat_name, //	是	string	分类名称
        keywords, //	是	string	分类关键字
        cat_desc, //	是	string	分类描述
        sort_order, //	是	int	排序
        is_show// 是	int	是否显示，0 1
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'change' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ],
        keywords: [
          { required: true, message: '分类关键词不能为空', trigger: 'change' },
          { validator: validateKeyword, trigger: 'change' }
        ],
        cat_desc: [
          { required: true, message: '分类描述不能为空', trigger: 'change' },
          { validator: validateDesc, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) { // 弹出窗口--添加分类
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { ...this.form, sort_order: +this.form.sort_order }
          !params.keywords && delete params.keywords //	是	string	分类关键字
          !params.cat_desc && delete params.cat_desc //	是	string	分类描述
          this.$emit('emitAdd', params)
        } else {
          return false
        }
      })
    },
    editForm(formName) { // 店铺分类编辑
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          !data.keywords && delete data.keywords //	是	string	分类关键字
          !data.cat_desc && delete data.cat_desc //	是	string	分类描述
          const catId = data.id
          delete data.id
          const params = { ...data, sort_order: +data.sort_order }
          this.$emit('emitEdit', params, catId)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('emitClose')
    }
  }
}
</script>

<style scoped>
  /*.help-block {*/
  /*  margin: 0;*/
  /*  height: 20px;*/
  /*  line-height: 20px;*/
  /*  font-size: 12px;*/
  /*  color: #999;*/
  /*}*/
</style>
