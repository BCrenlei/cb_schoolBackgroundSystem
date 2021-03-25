import request from '@/utils/request'

export function listEpqScore(params) {
  return request({
    url: '/epqScore/listEpqScore',
    method: 'get',
    params: params
  })
}

// 我的 epq列表：/epqScore/myListEpqScore
export function myListEpqScore(params) {
  return request({
    url: '/epqScore/myListEpqScore',
    method: 'get',
    params: params
  })
}

export function addEpqScore(params) {
  return request({
    url: '/epqScore/addEpqScore',
    method: 'post',
    data: params
  })
}

export function updateEpqScore(params) {
  return request({
    url: '/epqScore/updateEpqScore',
    method: 'post',
    data: params
  })
}

export function deleteEpqScore(params) {
  return request({
    url: '/epqScore/deleteEpqScore',
    method: 'post',
    data: params
  })
}

// 获取所有epq课程  可传 gradeId ，如果传了就是按照年级区分，不传就是所有
export function listEpqCourse(params) {
  return request({
    url: '/course/listEpqCourse',
    method: 'post',
    data: params
  })
}

