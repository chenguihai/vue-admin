<template>
  <div>
    <div class="base_info">
      您的店铺可发布服务{{ serviceObj.service_count }}个，已使用{{ serviceObj.service_has }}个，剩余{{ serviceObj.service_surplus
      }}个。升级会员，获取更多数量，<a :href="'/tollMarket/marketShop/marketShop?id=1' | prefixUrlF">去升级</a>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-col :xs="24" :md="12" :lg="8">
          <el-input v-model="form.name" style="width:100%" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="分类" prop="cat_id">
        <el-col :xs="24" :md="12" :lg="8">
          <el-cascader
            v-model="form.cat_id"
            :options="cateList"
            :props="optionProps"
            size="medium"
            style="width: 100%"
            @change="handleChange"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="品牌">
        <el-col :xs="24" :md="12" :lg="8">
          <el-cascader
            v-model="form.brand"
            clearable
            :options="brandoptions"
            size="medium"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="服务领域" prop="realm">
        <el-checkbox-group v-model="form.realm">
          <el-checkbox v-for="item in realmlist" :key="item.id" :label="item.id">{{ item.sr_name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="服务地区" prop="regions">
        <el-tag
          v-for="tag in form.regions"
          :key="tag.id"
          class="lister"
          :disable-transitions="false"
        >{{ tag.cityes }}
        </el-tag>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogFlag = true">添加服务地区</el-button>
      </el-form-item>
      <el-form-item label="售价" prop="price">
        <el-col :xs="24" :md="4" :lg="3">
          <el-form-item prop="price">
            <el-input v-model="form.price" clearable :disabled="priceCanEdit" />
          </el-form-item>
        </el-col>
        <el-col class="tr" :span="2">市场价&nbsp;&nbsp;</el-col>
        <el-col :xs="24" :md="4" :lg="3">
          <el-form-item prop="market_price">
            <el-input v-model="form.market_price" clearable :disabled="priceCanEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <div style="text-align: center">/</div>
        </el-col>
        <el-col :xs="24" :md="4" :lg="3">
          <el-form-item prop="unit">
            <el-select v-model="form.unit" placeholder="请选择">
              <el-option
                v-for="item in unitlist"
                :key="item.id"
                :label="item.unit_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="tr" :span="2">库存&nbsp;&nbsp;</el-col>
        <el-col :xs="24" :md="4" :lg="3">
          <el-form-item prop="stock">
            <el-input v-model="form.stock" clearable :disabled="priceCanEdit" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="店铺分类" prop="class">
        <el-col :xs="24" :md="16">
          <el-checkbox-group v-model="form.class">
            <el-checkbox v-for="item in store_catelist" :key="item.cat_id" :label="item.cat_id">{{
              item.cat_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-col :span="8" class="mr_20">
          <single-upload :url="form.img" @emitSubmit="emitUploadImg">
            <p class="help-block">
              用于各种列表展示，此处支持尺寸长高比为
              <em>5:3</em>
            </p>
          </single-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="服务视频">
        <el-col :span="12">
          <upload-video :url="form.video" @emitSubmit="emitVideo">
            <p class="help-block">
              用于各种列表展示，此处支持尺寸长高比为
              <em>5:3</em>
            </p>
          </upload-video>
        </el-col>
      </el-form-item>
      <el-form-item label="所属媒介资质">
        <el-col :span="8">
          <el-select v-model="form.intell" placeholder="请选择">
            <el-option value="" label="请选择" />
            <el-option
              v-for="item in aptitude_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-col :span="8">
          <el-input v-model="form.sort" clearable type="number" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="7">
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <!--      地区选择弹框-->
    <region-list v-if="dialogFlag" :list="form.regions" @close="emitClose" @submit="_handleSubmit" />
    <!--      添加/编辑店铺分类-->
    <!--    <store-class v-if="showFlag" type="0" @emitClose="emitClose" @emitAdd="emitAdd"/>-->
    <el-dialog title="提示" :visible.sync="showFlag" width="400px" center>
      <span>你还未添加店铺分类，请先添加店铺分类</span>
      <span slot="footer" class="dialog-footer">
        <router-link class="router_link" to="/product_manage/shop_catetory">去添加</router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getservicedata, getbranddata, baseInfoAdd, baseInfoEdit, getEditBaseInfo } from '@/api/service.js'
import citydata from '@/utils/city.json'
import { getToken } from '@/utils/auth'
import UploadVideo from '@/components/UploadImages/uploadVideo'
import SingleUpload from '@/components/UploadImages/singleUpload'
// import StoreClass from '@/components/StoreClass'
import RegionList from './regionList'
import { addcatetory } from '@/api/catetory.js'
import { messageCommon } from '@/utils/common.js'
import {
  getSingleOptionFun,
  getSelectOptionFun,
  getAllItemIdFun,
  uploadImageUrl
} from '@/utils/common'
  // uploadVideoUrl StoreClass

export default {
  name: 'Baseinfo',
  components: { SingleUpload, UploadVideo, RegionList },
  data() {
    const priceValidate = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      optionProps: {
        value: 'id',
        label: 'cate_name',
        children: 'child'
      },
      valid: 0, // 路上参数
      valtype: 1, // 路上参数
      fileAction: uploadImageUrl, // 上传图片地址
      fileHeaders: { 'Authorization': 'Bearer' + getToken() }, // 以上是属性
      brandoptions: [],
      cateList: [],
      realmlist: [],
      store_catelist: [],
      aptitude_list: [],
      unitlist: [],
      cat_id: [],
      fileList: [],
      fileListImg: [],
      fileListThumb: [],
      dialogFlag: false,
      serviceObj: {},
      priceCanEdit: false,
      showFlag: false,
      form: {
        name: '', // 服务名称
        img: '', // 主图
        video: '', // 服务视频url
        sort: 1, // 排序
        price: '', // 售价
        market_price: '', // 市场价
        unit: '', // 服务单位id
        stock: '', // 库存
        intell: '', // 服务媒介资质id

        cat_id: [], // 一二三级分类类目id
        brand: [], // 品牌数据id
        realm: [], // 服务领域id
        regions: [], // 地区编码
        class: []// 店铺分类id
      },
      rules: {
        name: [
          { required: true, message: '服务名称不能为空', trigger: 'change' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change' }
        ],
        img: [
          { required: true, message: '主图不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '售价不能为空', trigger: 'change' },
          { required: true, trigger: 'change', validator: priceValidate }
        ],
        market_price: [
          { required: true, message: '市场价不能为空', trigger: 'change' },
          { required: true, trigger: 'change', validator: priceValidate }
        ],
        stock: [
          { required: true, message: '库存不能为空', trigger: 'change' },
          { required: true, trigger: 'change', validator: priceValidate }
        ],
        unit: [
          { required: true, message: '服务单位不能为空', trigger: 'change' }
        ],
        realm: [
          { required: true, message: '服务领域不能为空', trigger: 'change' }
        ],
        class: [
          { required: true, message: '店铺分类不能为空', trigger: 'change' }
        ],
        cat_id: [
          { required: true, message: '分类不能为空', trigger: 'change' }
        ],
        regions: [
          { required: true, message: '服务地区不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    var valid = this.$route.query.id
    this.getbaseinfo()
    if (valid) {
      this.valid = valid
      this.getEditBaseInfoHttp()
    }
  },
  methods: {
    _handleSubmit(params) {
      this.form.regions = params
      this.emitClose()
    },
    emitClose() {
      this.showFlag = false
      this.dialogFlag = false
    },
    emitUploadImg(url) {
      this.form.img = url
    },
    emitAdd(params) { // emit
      this.addStoreFun(params)
    },
    emitVideo(url) {
      this.form.video = url.origin
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save_btn()
        } else {
          return false
        }
      })
    },
    save_btn() { // 数据保存
      if (!this.cat_id) {
        this.$message.error('请选择分类')
        return false
      }
      const { name, brand, img, video, class: classList = [], sort, market_price, stock, price, unit, intell, realm, regions } = this.form
      const objer = {
        name: name, // 服务名称
        img: img, // 主图
        class: classList.toString(),
        stock: stock.toString(),
        price: (+price).toFixed(2),
        market_price: (+market_price).toFixed(2),
        sort: parseInt(sort),
        cat_id: this.cat_id,
        realm: realm + '',
        regions: getAllItemIdFun(regions).toString(),
        unit: parseInt(unit),
        id: this.valid !== 0 ? this.valid : undefined,
        action: this.valid !== 0 ? this.valtype : undefined,

        intell: typeof intell === 'number' ? intell : -1, // 所属媒介资质
        brand: brand.length === 2 ? brand[1].toString() : '', // 品牌
        video: video || '' // 服务视频url
      }

      if (this.valid) {
        this.baseInfoEditFun(objer)
      } else {
        this.baseInfoAddFun(objer)
      }
    },
    baseInfoAddFun(objer) {
      baseInfoAdd(objer).then(res => {
        if (res.code === 200) {
          this.routerJumpFun('/product_manage/service_manage')
        } else {
          this.$message.warning(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    baseInfoEditFun(objer) {
      baseInfoEdit(objer).then(res => {
        if (res.code === 200) {
          this.routerJumpFun('/product_manage/service_manage')
        } else {
          this.$message.warning(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getEditBaseInfoHttp() {
      const params = {
        id: +this.valid,
        action: 1 // 1基础信息,2详细介绍,3图库,4规格属性
      }
      getEditBaseInfo(params).then(res => {
        if (res.code === 200) {
          const { name, img, video, sort, price, market_price, stock, cate, unit, aptitude, brand, realm, store_cate, regions, price_can_edit = 0 } = res.data
          const [catOption = [], objer = {}, catId = ''] = this.catOptionCommonFun(cate)
          this.cat_id = catId
          const selectArea = this.chooiceAreaList(regions)
          if (objer.one) {
            this.getbranddataFun(objer, brand)
          }
          this.priceCanEdit = !price_can_edit
          this.form = {
            name: name, // 服务名称
            img: img, // 主图
            video: video, // 服务视频url
            sort: sort, // 排序
            price: price, // 售价
            market_price: market_price, // 市场价
            stock: stock, // 库存
            unit: getSingleOptionFun(unit),
            realm: getSelectOptionFun(realm),
            intell: getSingleOptionFun(aptitude), // 服务媒介资质id
            class: this.storeCateSelectList(store_cate),
            brand: [],
            cat_id: catOption,
            regions: selectArea
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    catOptionCommonFun(cate) {
      let item = []
      let subItem = []
      let onevalue = ''
      let twovalue = ''
      let threevalue = ''
      const catOption = []
      for (let i = 0; i < cate.length; i++) {
        if (cate[i].checked === 1) { // 找出选中一级的id
          catOption.push(cate[i].id)
          onevalue = cate[i].id
          item = cate[i].child
          for (let j = 0; j < item.length; j++) {
            if (item[j].checked === 1) { // 找出选中二级的id
              catOption.push(item[j].id)
              twovalue = item[j].id
              subItem = item[j].child
              for (let k = 0; k < subItem.length; k++) {
                if (subItem[k].checked === 1) { // 找出选中三级的id
                  catOption.push(subItem[k].id)
                  threevalue = subItem[k].id
                  break
                }
              }
            }
          }
        }
      }
      const objer = {
        one: onevalue,
        two: twovalue,
        three: threevalue
      }
      const catId = onevalue + ',' + twovalue + ',' + threevalue
      return [catOption, objer, catId]
    },
    storeCateSelectList(data) { // 返回店铺分类的选着数组
      const select = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].checked === 1) {
          select.push(data[i].cat_id)
        }
      }
      return select
    },
    chooiceAreaList(regions) { // 返回城市的数据，选中数组
      const cityDatas = JSON.parse(JSON.stringify(citydata))
      // ["130000", "140000"]
      let cityItem = []
      const selectArea = []
      for (let i = 0; i < regions.length; i++) { // 服务地区
        for (let j = 0; j < cityDatas.length; j++) {
          if (regions[i] === cityDatas[j].id) {
            selectArea.push({
              id: cityDatas[j].id,
              cityes: cityDatas[j].name,
              pid: cityDatas[j].pid
            })
            break
          } else {
            cityItem = Array.isArray(cityDatas[j].child) ? cityDatas[j].child : [] // 有些没有child属性
            for (let k = 0; k < cityItem.length; k++) {
              if (regions[i] === cityItem[k].id) { // 选中
                selectArea.push({
                  id: cityItem[k].id,
                  cityes: cityItem[k].name,
                  pid: cityItem[k].pid
                })
                break
              }
            }
          }
        }
      }
      return selectArea
    },
    getbaseinfo() {
      getservicedata().then(res => {
        if (res.code === 200) {
          const { cate, realm, store_cate, aptitude, unit, service_count = 0, service_has = 0, service_surplus = 0 } = res.data
          if (store_cate.length === 0) {
            this.showFlag = true
          }
          this.cateList = cate // 交保证金的类目列表
          this.realmlist = realm // 技能入驻时选择的擅长领域
          this.store_catelist = store_cate // 店铺已添加分类(非类目数据)
          this.aptitude_list = aptitude // 店铺资料已添加的资质类型
          this.unitlist = unit // 平台单位基础数据
          this.serviceObj = {
            service_count,
            service_has,
            service_surplus
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleImgSuccess(response, file, fileList) {
      this.form.img = response.data.file
    },
    handleVideoSuccess(response, file, fileList) {
      this.form.video = response.data
    },
    beforeRemove() { // 图片上传前
      this.fileList = []
      this.form.video = ''
    },
    beforeRemoveImg() { // 图片上传前
      this.fileListImg = []
      this.form.img = ''
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleChange(val) { // 得到品牌数据
      const [onevalue, twovalue, threevalue] = val
      this.cat_id = onevalue + ',' + twovalue + ',' + threevalue
      const objer = {
        one: onevalue,
        two: twovalue,
        three: threevalue
      }
      this.getbranddataFun(objer)
    },
    getbranddataFun(objer, brand = {}) {
      getbranddata(objer).then(res => {
        if (res.code === 200) {
          const datalist = res.data
          const newarray = []
          for (var catename in datalist) {
            var childarray = []
            const objer = {
              label: catename,
              value: catename,
              children: childarray
            }
            newarray.push(objer)
            const cateinfo = datalist[catename] // 分类内容
            for (let i = 0; i < cateinfo.length; i++) {
              const childobj = {
                value: cateinfo[i].id,
                label: cateinfo[i].brand_name
              }
              if (brand && brand.id === cateinfo[i].id) {
                this.form.brand = [catename, brand.id]
              }
              childarray.push(childobj)
            }
          }
          this.brandoptions = newarray
        }
      }).catch(err => {
        console.log(err)
      })
    },
    routerJumpFun(path) {
      this.$message({
        type: 'success',
        message: '添加成功!'
      })
      this.$router.push({
        path
      })
    },
    addStoreFun(params) {
      addcatetory(params).then(res => {
        if (res.code === 200) {
          this.store_catelist = [res.data]
          messageCommon(this, '操作成功')
          this.emitClose()
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

<style lang="scss" scoped>
  .base_info {
    line-height: 32px;
    margin-bottom: 20px;
    text-indent: 100px;

    a {
      color: #1890ff;
    }
  }

  .imglist {
    position: absolute;
    top: 49px;
    left: 10px;
    z-index: 10;
    width: 100%;
    height: 70px;
    display: block;
  }

  /*p.help-block {*/
  /*  position: relative;*/
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

  .lister {
    margin-right: 10px;
  }

  .router_link {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
  }
</style>
