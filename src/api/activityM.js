import request from '@/utils/request'

// 用户/用户组/权限相关   /user/list     /user/addUser        /user/updateUser       /user/getAllRoles       /user/listRole    /user/listAllPermission    /user/addRole    /user/updateRole   /user/deleteRole

// 用户组
export function listAllPermission() {
  return request({
    url: '/user/listAllPermission',
    method: 'get'
  })
}

export function listRole() {
  return request({
    url: '/user/listRole',
    method: 'get'
  })
}

export function addRole(params) {
  return request({
    url: '/user/addRole',
    method: 'post',
    data: params
  })
}

export function deleteRole(params) {
  return request({
    url: '/user/deleteRole',
    method: 'post',
    data: params
  })
}

export function updateRole(params) {
  return request({
    url: '/user/updateRole',
    method: 'post',
    data: params
  })
}

// 用户
export function listUser() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function addUser(params) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: params
  })
}

// 角色：    dict/addDict    dict/selectRole 
export function listDict() {
  return request({
    url: '/dict/selectRole',
    method: 'get'
  })
}

export function addDict(params) {
  return request({
    url: '/dict/addDict',
    method: 'post',
    data: params
  })
}

export function updateDict(params) {
  return request({
    url: '/dict/updateDict',
    method: 'post',
    data: params
  })
}

export function deleteDict(params) {
  return request({
    url: '/dict/deleteDict',
    method: 'post',
    data: params
  })
}

export function selectRole(params) {
  return request({
    url: '/dict/selectRole',
    method: 'post',
    data: params
  })
}
