import request from '@/utils/request'

// 学习详情列表  /details/listLearningDetails
export function listLearningDetails(params) {
  return request({
    url: '/details/listLearningDetails',
    method: 'get',
    params: params
  })
}

// 我的学习详情管理：/details/myLearningDetails
export function myLearningDetails(params) {
  return request({
    url: '/details/myLearningDetails',
    method: 'get',
    params: params
  })
}

export function addLearningDetails(params) {
  return request({
    url: '/details/addLearningDetails',
    method: 'post',
    data: params
  })
}

export function updateLearningDetails(params) {
  return request({
    url: '/details/updateLearningDetails',
    method: 'post',
    data: params
  })
}

export function deleteLearningDetails(params) {
  return request({
    url: '/details/deleteLearningDetails',
    method: 'post',
    data: params
  })
}

