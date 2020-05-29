import axios from 'axios'
import { getToken } from '@/utils/auth'
// import route from '../router/index'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    const token = getToken() || ''
    // config.headers['Content-Type'] = 'application/json'
    // config.headers['Accept'] = 'application/vnd.zhongmei.v1+json'
    config.headers['Authorization'] = 'Bearer ' + token
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // res.code == 0 ||
    if (res.code === 401) {
      localStorage.clear()
      sessionStorage.clear()
      // route.push('/login')
      window.location.href = location.origin + '/login'
      // window.location.href = '/#login'
      return Promise.reject(res.message)
    } else {
      return res
    }
  },
  error => {
    if (error.response.status === 401) {
      localStorage.clear()
      sessionStorage.clear()
      // route.push('/login')
      window.location.href = location.origin + '/login'
    }
    return Promise.reject(error)
  }
)

export default service
