import request from '@/utils/request'

export function listExamManage(params) {
  return request({
    url: '/examManage/listExamManage',
    method: 'get',
    params: params
  })
}

export function listExamManageAll(params) {
  return request({
    url: '/examManage/listExamManageAll',
    method: 'get',
    params: params
  })
}

// 我的 考试管理：/examManage/myListExamManage
export function myListExamManage(params) {
  return request({
    url: '/examManage/myListExamManage',
    method: 'get',
    params: params
  })
}

export function addExamManage(params) {
  return request({
    url: '/examManage/addExamManage',
    method: 'post',
    data: params
  })
}

export function updateExamManage(params) {
  return request({
    url: '/examManage/updateExamManage',
    method: 'post',
    data: params
  })
}

export function deleteExamManage(params) {
  return request({
    url: '/examManage/deleteExamManage',
    method: 'post',
    data: params
  })
}

export function selectExamManageByCourseId(params) {
  return request({
    url: '/examManage/selectExamManageByCourseId',
    method: 'post',
    data: params
  })
}
