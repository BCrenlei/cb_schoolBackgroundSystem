import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const LoginTokenKey = 'JSESSIONID'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLoginCookiesToken() {
  return Cookies.get(LoginTokenKey)
}

export function getLocalToken() {
  return window.localStorage.getItem(LoginTokenKey)
}

export function setLocalToken(token) {
  return window.localStorage.setItem(LoginTokenKey, token)
}

export function removeLocalToken() {
  return window.localStorage.removeItem(LoginTokenKey)
}
