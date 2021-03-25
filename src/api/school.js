import request from '@/utils/request'

// 机构管理类 /institution/listInstitution   /institution/deleteInstitution  /institution/institutionDetails  /institution/addInstitution  /institution/updateInstitution


export function schoolList(params) {
  return request({
    url: '/institution/listInstitution',
    method: 'get',
    params: params
  })
}

export function deleteSchool(params) {
  return request({
    url: '/institution/deleteInstitution',
    method: 'post',
    data: params
  })
}

export function addSchool(params) {
  return request({
    url: '/institution/addInstitution',
    method: 'post',
    data: params
  })
}

export function updateSchool(params) {
  return request({
    url: '/institution/updateInstitution',
    method: 'post',
    data: params
  })
}
