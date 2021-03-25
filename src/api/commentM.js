import request from '@/utils/request'

export function listCommentManage(params) {
  return request({
    url: '/commentManage/listCommentManage',
    method: 'get',
    params: params
  })
}

export function addCommentManage(params) {
  return request({
    url: '/commentManage/addCommentManage',
    method: 'post',
    data: params
  })
}

export function updateCommentManage(params) {
  return request({
    url: '/commentManage/updateCommentManage',
    method: 'post',
    data: params
  })
}

export function deleteCommentManage(params) {
  return request({
    url: '/commentManage/deleteCommentManage',
    method: 'post',
    data: params
  })
}
