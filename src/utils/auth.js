import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'access_token'
const USER_INFO = 'userInfo'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('access_token')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setUserInfo(token) {
  return Cookies.set(USER_INFO, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const username = 'username'

export function getname() {
  return Cookies.get(username)
}

export function setname(name) {
  return Cookies.set(username, name)
}

export function removeName() {
  return Cookies.remove(username)
}

const user_id = 'user_id'
export function getId() {
  return Cookies.get(user_id)
}

export function setId(id) {
  return Cookies.set(user_id, id)
}

export function removeId() {
  return Cookies.remove(user_id)
}

