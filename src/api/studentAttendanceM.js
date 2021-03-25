import request from '@/utils/request'
// 学生考勤管理



// 学生基本信息类  /student/listStudentUser    /student/addStudentUser     /student/updateStudentUser    /student/deleteStudentUser


export function listAttendance(params) {
  return request({
    url: '/attendance/listAttendance',
    method: 'get',
    params: params
  })
}

export function addAttendance(params) {
  return request({
    url: '/attendance/addAttendance',
    method: 'post',
    data: params
  })
}

export function updateAttendance(params) {
  return request({
    url: '/attendance/updateAttendance',
    method: 'post',
    data: params
  })
}

export function deleteAttendance(params) {
  return request({
    url: '/attendance/deleteAttendance',
    method: 'post',
    data: params
  })
}

//askLeave/listAskLeave
export function listAskLeave(params) {
  return request({
    url: '/askLeave/listAskLeave',
    method: 'get',
    params: params
  })
}

export function updateAskLeave(params) {
  return request({
    url: '/askLeave/updateAskLeave',
    method: 'post',
    data: params
  })
}

export function addAskLeave(params) {
  return request({
    url: '/askLeave/addAskLeave',
    method: 'post',
    data: params
  })
}

export function deleteAskLeave(params) {
  return request({
    url: '/askLeave/deleteAskLeave',
    method: 'post',
    data: params
  })
}


