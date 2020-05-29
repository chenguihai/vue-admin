// import request from '@/utils/request'
import axios from 'axios'
import { removeUrl } from '@/utils/common'
// export function removeFile(data) {
//     return request({
//         url: '/removeFile',
//         method: 'POST',
//         data
//     })
// }

export const removeFile = (data) => { // 头部公共接口
  return axios.post(removeUrl, data)
}
