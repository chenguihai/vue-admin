<template>
  <div class="content_list">
    <div class="base_info" v-if="!selectId">
      您的店铺每天可发布{{ form.type ===1 ?'上刊图片':'上刊视频' }}{{ canPublish }}个，已使用{{ hasPublish }}个，剩余{{ canPublish-hasPublish
      }}个。升级会员，获取更多数量，<a
      :href="'/tollMarket/marketShop/marketShop?id=1' | prefixUrlF"
    >去升级</a>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="w_400" clearable/>
      </el-form-item>
      <template v-if="form.type ===1">
        <el-form-item label="上刊图片" prop="source_file">
          <el-col :span="8" class="mr_20">
            <single-upload :url="form.source_file" btn="上传原图" type="1" @emitSubmit="emitUploadImg"/>
          </el-col>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="视频源文件" prop="source_file">
          <el-col :span="12">
            <upload-video btn="选择文件" :url="form.source_file" @emitSubmit="emitVideo">
              <p class="help-block">上传的视频文件时长限制：5-300秒，每个大小不超过 300MB。</p>
              <p slot="footer" class="help-block">本次上传文件时长：{{ form.duration ? parseInt(form.duration) : 2 }} 秒</p>
            </upload-video>
          </el-col>
        </el-form-item>
        <el-form-item label="允许试看时长" prop="try_see">
          <template>
            <el-input v-model="form.try_see" type="number" class="w_400" clearable/>
            <span>&nbsp;&nbsp;秒</span>
            <p class="help-block">试看时长不能低于2秒或超过视频时长的一半</p>
          </template>
        </el-form-item>
      </template>
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" type="number" class="w_400" clearable/>
      </el-form-item>
      <el-form-item label="上刊领域" prop="realm_id">
        <el-select v-model="form.realm_id" placeholder="请选择">
          <el-option v-for="(item,index) in journalRealm" :key="item.id" :label="item.sr_name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="媒体类型" prop="jmt_id">
        <el-select v-model="form.jmt_id" placeholder="请选择">
          <el-option v-for="(item,index) in journalType" :key="item.id" :label="item.type_name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="投放城市" prop="city">
        <el-select v-model="form.province" placeholder="请选择" @change="provinceChange">
          <el-option
            v-for="(item,index) in cityJson"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="form.city" placeholder="请选择">
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上刊标签" prop="jit_id">
        <el-checkbox-group v-model="form.jit_id">
          <el-checkbox v-for="item in journalTag" :key="item.id" :label="item.id+''">{{ item.tag_name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="拍摄时间" prop="shoot">
        <el-date-picker
          v-model="form.shoot"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="拍摄地点" prop="address">
        <el-input v-model="form.address" class="w_400" clearable/>
      </el-form-item>
      <el-form-item label="上刊介绍" prop="introduce">
        <el-input v-model="form.introduce" class="w_400" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loadingFlag" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SingleUpload from '@/components/UploadImages/singleUpload'
import UploadVideo from '@/components/UploadImages/uploadVideo'
import { journalInfo, addRequest, editRequest } from '@/api/cms/lastIssue'
import city from '@/utils/city'

export default {
  name: 'AddLastIssue',
  components: { SingleUpload, UploadVideo },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('价格不能小于1'))
      } else {
        callback()
      }
    }
    const { type = 1, id = '', can = 0, has = 0 } = this.$route.query
    let cityJ = JSON.parse(JSON.stringify(city))
    cityJ.shift()
    return {
      cityJson: cityJ,
      cityList: [],
      form: {
        type: +type || 1, //	是	int	类型：1图片，2视频
        name: '', //	是	string	上刊名称
        price: '', //	是	string	价格
        realm_id: '', //	是	int	上刊领域id
        jmt_id: '', //	是	int	上刊媒体类型id
        jit_id: [], //	是	int	上刊画面标签id
        province: '', //	是	string	省id
        city: '', //	是	string	市id
        shoot: '', //	是	int	拍摄时间
        address: '', //	是	int	拍摄地点
        introduce: '', //	是	int	上刊介绍

        source_file: '', //	是	string	上传原文件(图片视频)

        duration: '', //	是	string	视频总时长（视频）
        try_see: '', //	是	int	视频试看时长（视频）
        preview: '', //	是	string	模糊预览图（图片）
        image_l: '', //	是	string	1000*600大图
        image_s: ''//	是	string	300*180小图
      },
      rules: {// type: 'date',
        name: [
          { required: true, message: '请输入上刊名称', trigger: 'change' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change' }
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'change' },
          { validator: validatePrice, trigger: 'change' }],
        realm_id: [{ required: true, message: '请选择上刊领域', trigger: 'change' }],
        jmt_id: [{ required: true, message: '请选择上刊媒体类型', trigger: 'change' }],
        jit_id: [{ type: 'array', required: true, message: '请至少选择一个上刊画面标签', trigger: 'change' }],
        city: [{ required: true, message: '请选择投放城市', trigger: 'change' }],
        shoot: [{ required: true, message: '请选择拍摄时间', trigger: 'change' }],
        address: [{ required: true, message: '请输入拍摄地点', trigger: 'change' }],
        introduce: [{ required: true, message: '请填写上刊介绍', trigger: 'change' }],
        source_file: [{ required: true, message: type === '2' ? '请上传视频源文件' : '请上传原文件', trigger: 'change' }],
        try_see: [{ required: type === '2', message: '请输入允许试看时长', trigger: 'change' }]
      },
      journalInfo: {},
      journalRealm: [], // 上刊领域
      journalType: [], // 上刊媒体类型
      journalTag: [], // 上刊标签
      canPublish: +can,
      hasPublish: +has,
      selectId: id,
      loadingFlag: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    provinceChange(val) {
      this.getCitycommon(val)
      this.form.city = ''
    },
    getCitycommon(val) {
      const item = this.cityJson
      for (let i = 0; i < item.length; i++) {
        if (item[i].id === val) {
          this.cityList = item[i].child
          break
        }
      }
    },
    emitUploadImg(item) {
      this.uploadCommon(item, 'img')
    },
    emitVideo(item) {
      this.uploadCommon(item)
    },
    uploadCommon(item, type = 'video') {
      if (type === 'img') {
        this.form.preview = item.preview //	是	string	模糊预览图（图片）
      } else {
        this.form.duration = item.duration //	是	string	视频总时长（视频）
      }
      this.form.source_file = item.origin
      this.form.image_l = item.image_l //	是	string	1000*600大图
      this.form.image_s = item.image_s //	是	string	300*180小图
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.selectId && this.canPublish <= this.hasPublish) {
            this.$message.warning('可发布的数量已使用完，明天再来')
            return
          }
          const param = JSON.parse(JSON.stringify(this.form))
          if (this.form.type === 1) { //  图片
            delete param.duration
            delete param.try_see
          } else { // 视频
            if (param.try_see <= 2) {
              this.$message.warning('试看时长不能低于2秒')
              return
            } else if (param.try_see * 2 > param.duration) {
              this.$message.warning('试看时长不能超过视频时长的一半')
              return
            }
            delete param.preview
          }
          param.jit_id = param.jit_id.toString()
          if (this.selectId) {
            this.editReq(param)
          } else {
            this.addReq(param)
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getList() {
      journalInfo(this.selectId).then(res => {
        const { journal_info, journal_realm, journal_type, journal_tag } = res
        if (this.selectId) {
          this.journalInfo = journal_info
          this.form = {
            type: journal_info.type, //	是	int	类型：1图片，2视频
            name: journal_info.name, //	是	string	上刊名称
            price: journal_info.price, //	是	string	价格
            realm_id: journal_info.realm_id, //	是	int	上刊领域id
            jmt_id: journal_info.jmt_id, //	是	int	上刊媒体类型id
            jit_id: !journal_info.jit_id ? [] : journal_info.jit_id.split(','), //	是	int	上刊画面标签id
            province: journal_info.province + '', //	是	string	省id
            city: journal_info.city + '', //	是	string	市id
            shoot: journal_info.shoot, //	是	int	拍摄时间
            address: journal_info.address, //	是	int	拍摄地点
            introduce: journal_info.introduce, //	是	int	上刊介绍

            source_file: journal_info.source_file, //	是	string	上传原文件(图片视频)

            duration: journal_info.duration, //	是	string	视频总时长（视频）
            try_see: journal_info.try_see, //	是	int	视频试看时长（视频）
            preview: journal_info.preview, //	是	string	模糊预览图（图片）
            image_l: journal_info.image_l, //	是	string	1000*600大图
            image_s: journal_info.image_s//	是	string	300*180小图
          }
        }
        this.journalRealm = journal_realm
        this.journalType = journal_type
        this.journalTag = journal_tag
        this.getCitycommon(journal_info.province + '')
      }).catch((err) => {
        console.log(err)
      })
    },
    addReq(param) {
      this.loadingFlag = true
      addRequest(param).then(res => {
        if (res.code === 1) {
          this.routerLink(this.form.type)
        } else {
          this.$message.error('添加失败')
        }
        this.loadingFun()
      }).catch((err) => {
        console.log(err)
        this.loadingFun()
      })
    },
    editReq(param) {
      this.loadingFlag = true
      editRequest(this.selectId, param).then(res => {
        if (res.code === 1) {
          this.routerLink(this.form.type)
        } else {
          this.$message.error('编辑失败')
        }
        this.loadingFun()
      }).catch((err) => {
        console.log(err)
        this.loadingFun()
      })
    },
    loadingFun() {
      this.loadingFlag = false
    },
    routerLink(type) {
      this.$router.push({ path: '/product_manage/lastIssueManage', query: { type: type } })
    }
  }
}
</script>

<style scoped lang="scss">
  .base_info {
    line-height: 32px;
    margin: 20px 0;
    text-indent: 100px;

    a {
      color: #1890ff;
    }
  }

  .w_400 {
    width: 400px;
  }
</style>
