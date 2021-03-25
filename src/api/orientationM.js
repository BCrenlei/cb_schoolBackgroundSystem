import request from '@/utils/request'

// 合作名校
export function listCooperationSchools(params) {
  return request({
    url: '/cooperationSchools/listCooperationSchools',
    method: 'get',
    params: params
  })
}

export function listCooperationSchoolsAll(params) {
  return request({
    url: '/cooperationSchools/listCooperationSchoolsAll',
    method: 'get',
    params: params
  })
}

export function addCooperationSchools(params) {
  return request({
    url: '/cooperationSchools/addCooperationSchools',
    method: 'post',
    data: params
  })
}

export function updateCooperationSchools(params) {
  return request({
    url: '/cooperationSchools/updateCooperationSchools',
    method: 'post',
    data: params
  })
}

export function deleteCooperationSchools(params) {
  return request({
    url: '/cooperationSchools/deleteCooperationSchools',
    method: 'post',
    data: params
  })
}

// 申请记录
export function listApplicationRecord(params) {
  return request({
    url: '/applicationRecord/listApplicationRecord',
    method: 'get',
    params: params
  })
}

export function addApplicationRecord(params) {
  return request({
    url: '/applicationRecord/addApplicationRecord',
    method: 'post',
    data: params
  })
}

export function updateApplicationRecord(params) {
  return request({
    url: '/applicationRecord/updateApplicationRecord',
    method: 'post',
    data: params
  })
}

export function deleteApplicationRecord(params) {
  return request({
    url: '/applicationRecord/deleteApplicationRecord',
    method: 'post',
    data: params
  })
}
