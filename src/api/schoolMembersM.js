import request from '@/utils/request'

// 老师管理类  /teacher/listTeacherUser    /teacher/addTeacherUser    /teacher/updateTeacherUser   /teacher/deleteTeacherUser

// 学生基本信息类  /student/listStudentUser    /student/addStudentUser     /student/updateStudentUser    /student/deleteStudentUser

// 角色相关   /dept/listDept     /dept/addDept   /dept/updateDept

export function listTeacherUser(params) {
  return request({
    url: '/teacher/listTeacherUser',
    method: 'get',
    params: params
  })
}

export function listTeacherUserAll(params) {
  return request({
    url: '/teacher/listTeacherUserAll',
    method: 'get',
    params: params
  })
}

export function addTeacherUser(params) {
  return request({
    url: '/teacher/addTeacherUser',
    method: 'post',
    data: params
  })
}

export function updateTeacherUser(params) {
  return request({
    url: '/teacher/updateTeacherUser',
    method: 'post',
    data: params
  })
}

export function deleteTeacherUser(params) {
  return request({
    url: '/teacher/deleteTeacherUser',
    method: 'post',
    data: params
  })
}

// 学生
export function listStudentUser(params) {
  return request({
    url: '/student/listStudentUser',
    method: 'get',
    params: params
  })
}

export function addStudentUser(params) {
  return request({
    url: '/student/addStudentUser',
    method: 'post',
    data: params
  })
}

export function updateStudentUser(params) {
  return request({
    url: '/student/updateStudentUser',
    method: 'post',
    data: params
  })
}

export function deleteStudentUser(params) {
  return request({
    url: '/student/deleteStudentUser',
    method: 'post',
    data: params
  })
}

// 学生档案
export function listStudentProfile(params) {
  return request({
    url: '/profile/listStudentProfile',
    method: 'post',
    data: params
  })
}

export function addStudentProfile(params) {
  return request({
    url: '/profile/addStudentProfile',
    method: 'post',
    data: params
  })
}

export function updateStudentProfile(params) {
  return request({
    url: '/profile/updateStudentProfile',
    method: 'post',
    data: params
  })
}

export function deleteStudentProfile(params) {
  return request({
    url: '/profile/deleteStudentProfile',
    method: 'post',
    data: params
  })
}

// 角色： dict/selectRole    dict/addDict    dict/updateDict  dict/deleteDict
export function listDict(params) {
  return request({
    url: '/dict/selectRole',
    method: 'post',
    data: params
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

export function updateImage(params) {
  return request({
    // url: 'http://7xr0ut.dl1.z0.glb.clouddn.com',
    url: 'http://p74a1x231.bkt.clouddn.com',
    method: 'post',
    data: params
  })
}

