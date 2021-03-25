import request from '@/utils/request'

export function loginByUsername(params) {
  return request({
    url: '/login/auth',
    method: 'post',
    data: params
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/login/getInfo',
    method: 'post'
  })
}

