import request from '@/utils/request'

export function listSchoolBusRecords(params) {
  return request({
    url: '/schoolBusRecords/listSchoolBusRecords',
    method: 'get',
    params: params
  })
}

export function addSchoolBusRecords(params) {
  return request({
    url: '/schoolBusRecords/addSchoolBusRecords',
    method: 'post',
    data: params
  })
}

export function updateSchoolBusRecords(params) {
  return request({
    url: '/schoolBusRecords/updateSchoolBusRecords',
    method: 'post',
    data: params
  })
}

export function deleteSchoolBusRecords(params) {
  return request({
    url: '/schoolBusRecords/deleteSchoolBusRecords',
    method: 'post',
    data: params
  })
}

// 报名学生
export function listSchoolBusRegistration(params) {
  return request({
    url: '/schoolBusRegistration/listSchoolBusRegistration',
    method: 'post',
    data: params
  })
}

export function addSchoolBusRegistration(params) {
  return request({
    url: '/schoolBusRegistration/addSchoolBusRegistration',
    method: 'post',
    data: params
  })
}

export function deleteSchoolBusRegistration(params) {
  return request({
    url: '/schoolBusRegistration/deleteSchoolBusRegistration',
    method: 'post',
    data: params
  })
}
