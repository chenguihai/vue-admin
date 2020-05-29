<template>
  <el-dialog
    title="填写收票地址"
    :visible.sync="showFlag"
    :close-on-click-modal="false"
    width="600px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="收票地址" prop="addr">
        <el-cascader
          v-model="form.addr"
          :props="optionProps"
          :options="cityDatas"
        />
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="form.address" placeholder="详情地址"/>
      </el-form-item>
      <el-form-item label="收票人" prop="name">
        <el-input v-model="form.name" placeholder="请输入收票人"/>
      </el-form-item>
      <el-form-item prop="phone" label="联系电话">
        <el-input
          v-model="form.phone"
          placeholder="请输入电话号码"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import citydata from '@/utils/city.json'

export default {
  name: 'TicketAddress',
  data() {
    let cityJSon = JSON.parse(JSON.stringify(citydata))
    cityJSon.shift()
    return {
      showFlag: true,
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      cityDatas: cityJSon,
      form: {
        addr: [],
        address: '',
        name: '',
        phone: '',
        province: '', //	是	string	省编码110105
        city: '', //	是	string	市编码110105
        district: ''//	是	string	县编码110105
      },
      rules: {
        addr: [
          { required: true, message: '收票地址不能为空', trigger: 'change' }
        ],
        address: [
          { required: true, message: '详情地址不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '收票人不能为空', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // this.cityDatas = JSON.parse(JSON.stringify(citydata))
  },
  methods: {
    submitForm(formName) { // 修改 订单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('emitTicketAddress', this.form)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('emitCloseDialog')
    }
  }
}
</script>

<style scoped>

</style>
