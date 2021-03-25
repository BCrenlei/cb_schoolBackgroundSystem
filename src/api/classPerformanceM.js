import request from '@/utils/request'

export function listClassPerformance(params) {
  return request({
    url: '/classPerformance/listClassPerformance',
    method: 'get',
    params: params
  })
}

// 自己创建的课堂表现管理：/classPerformance/myListClassPerformance
export function myListClassPerformance(params) {
  return request({
    url: '/classPerformance/myListClassPerformance',
    method: 'get',
    params: params
  })
}

export function addClassPerformance(params) {
  return request({
    url: '/classPerformance/addClassPerformance',
    method: 'post',
    data: params
  })
}

export function updateClassPerformance(params) {
  return request({
    url: '/classPerformance/updateClassPerformance',
    method: 'post',
    data: params
  })
}

export function deleteClassPerformance(params) {
  return request({
    url: '/classPerformance/deleteClassPerformance',
    method: 'post',
    data: params
  })
}