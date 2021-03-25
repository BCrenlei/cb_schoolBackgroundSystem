import request from '@/utils/request'
// 课程报名管理



// 课程报名列表  /apply/listUserApply
export function listUserCourse(params) {
  return request({
    url: '/apply/listUserApply',
    method: 'get',
    params: params
  })
}

// 我的课程报名列表  /apply/listUserApply
export function myListUserApply(params) {
  return request({
    url: '/apply/myListUserApply',
    method: 'get',
    params: params
  })
}

export function addUserApply(params) {
  return request({
    url: '/apply/addUserApply',
    method: 'post',
    data: params
  })
}

export function updateUserApply(params) {
  return request({
    url: '/apply/updateUserApply',
    method: 'post',
    data: params
  })
}

export function deleteUserApply(params) {
  return request({
    url: '/apply/deleteUserApply',
    method: 'post',
    data: params
  })
}

