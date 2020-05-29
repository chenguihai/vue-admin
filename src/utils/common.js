import citydata from '@/utils/city.json'

export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime(number, format) {
  const time = new Date(number)
  const newArr = []
  const formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  newArr.push(time.getFullYear())
  newArr.push(formatNumber(time.getMonth() + 1))
  newArr.push(formatNumber(time.getDate()))
  newArr.push(formatNumber(time.getHours()))
  newArr.push(formatNumber(time.getMinutes()))
  newArr.push(formatNumber(time.getSeconds()))
  for (const i in newArr) {
    format = format.replace(formatArr[i], newArr[i])
  }
  return format
}

export function messageCommon(that, msg, type = 'success') { // 成功信息的发布
  that.$message({
    message: msg,
    type: type
  })
}

export function selectChangeCommonFun(data, option) {
  for (let j = 0; j < data.length; j++) { // 取消全部选中
    data[j].checked = 0
    for (let i = 0; i < option.length; i++) {
      if (option[i] === data[j].id) { // 选中
        data[j].checked = 1
      }
    }
  }
  return data
}

export function getAllItemIdFun(data) { // 返回数组的选项
  const option = []
  for (let i = 0; i < data.length; i++) {
    option.push(data[i].id)
  }
  return option
}

export function getSelectOptionFun(data) { // 返回数组的选项
  const option = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].checked === 1) {
      option.push(data[i].id)
    }
  }
  return option
}

export function getSingleOptionFun(data) { // 返回单个的选项
  let selectId
  for (let i = 0; i < data.length; i++) {
    if (data[i].checked === 1) {
      selectId = data[i].id
      break
    }
  }
  return selectId
}

export function datePickerToArr(data) { // 返回单个的选项
  const flag = data && data.length > 0
  const [start_time, end_time] = data || [0, 0]
  const startTime = flag ? start_time.getTime() : start_time
  const endTime = flag ? end_time.getTime() : end_time
  return [startTime, endTime]
}

export function formatTimeStamp(now) {
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var date = now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

export function formatSearchTime(data) {
  const flag = data && data.length > 0
  const [start_time, end_time] = data || ['', '']
  const startTime = flag ? start_time / 1000 : null
  const endTime = flag ? end_time / 1000 : null
  return [startTime, endTime]
}

export function formatDate(data) {
  const flag = data && data.length > 0
  const [start_time, end_time] = data || ['', '']
  const startTime = flag ? start_time : null
  const endTime = flag ? end_time : null
  return [startTime, endTime]
}

export function addressCommon(data) {
  for (let m = 0; m < data.length; m++) {
    data[m].addressPrefix = addressCommonFun(data[m])
  }
  return data
}

export function addressCommonFun(data) {
  let item = []
  let subItem = []
  if ((data.district + '').length < 5) {
    return ''
  }
  const { province, city, district } = data
  for (let i = 0; i < citydata.length; i++) { // 省
    if (+citydata[i].id === province) {
      item = citydata[i].child || []
      for (let j = 0; j < item.length; j++) { // 市
        if (+item[j].id === city) {
          subItem = item[j].child || []
          for (let k = 0; k < subItem.length; k++) { // 区
            if (+subItem[k].id === district) {
              const num = item[j].name.indexOf(citydata[i].name)
              return `${num !== -1 ? '' : citydata[i].name}${item[j].name}${subItem[k].name}`
            }
          }
        }
      }
    }
  }
}

export const development = process.env.NODE_ENV !== 'production' // 环境
export const devAlyUrl = 'http://ltzm1.oss-cn-shenzhen.aliyuncs.com/'
export const proAlyUrl = 'https://img.ltzm66.com/'

const baseUrl = development ? 'https://api.lingtianzhongmei.com/admin/' : 'https://api.zhongmei66.com/admin/'
// export const aliyunUrl = development ? devAlyUrl : location.host.includes('zhongmei66.com') ? proAlyUrl : devAlyUrl // 存储图片地址
export const aliyunUrl = development ? devAlyUrl : proAlyUrl // 存储图片地址
export const uploadImageUrl = baseUrl + 'uploadImage' // 上传图片地址 upimg
export const uploadVideoUrl = baseUrl + 'uploadVideo' // 上传视频地址 upvideo
export const uploadFileUrl = baseUrl + 'uploadCase' // 上传文件
export const photoAboveUrl = baseUrl + 'imageBlur' // 上刊图片
export const removeUrl = baseUrl + 'removeFile' // 上刊图片

/**
 * javascript验证纳税人识别号格式
 * @param  taxId [纳税人识别号]
 * @return true格式正确，false格式错误
 */
export function checkTaxId(taxId) {
  var regArr = [/^[\da-z]{10,15}$/i, /^\d{6}[\da-z]{10,12}$/i, /^[a-z]\d{6}[\da-z]{9,11}$/i, /^[a-z]{2}\d{6}[\da-z]{8,10}$/i, /^\d{14}[\dx][\da-z]{4,5}$/i, /^\d{17}[\dx][\da-z]{1,2}$/i, /^[a-z]\d{14}[\dx][\da-z]{3,4}$/i, /^[a-z]\d{17}[\dx][\da-z]{0,1}$/i, /^[\d]{6}[\da-z]{13,14}$/i]
  var j = regArr.length
  for (var i = 0; i < j; i++) {
    if (regArr[i].test(taxId)) {
      return true
    }
  }
  // 纳税人识别号格式错误
  return false
}

/**
 *
 <ul>
 <li v-for="(value, key, index) of orderStatus" :key="value">{{key}}{{value}}</li>
 </ul>

 */

/**
 getOrderRefundistHttp() {
        getOrderRefundist(this.form).then(res => {
          if (res.code === 200) {
            const { data = [] } = res.data
          } else {
            messageCommon(this, res.message, 'error')
          }
        }).catch(err => {
          console.log(err)
        })
      },

 var valid = this.$route.query.id

 */
