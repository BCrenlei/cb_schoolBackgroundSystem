import request from '@/utils/request'
// 学校基本设置

// 1.学期管理   /semester/listSysSemester   /semester/addSysSemester  /semester/updateSysSemester      /semester/deleteSysSemester
// [{"semesterName":"2017年度上学期","startTime":"2017/03/01","endTime":"2017/06/30"},{"semesterName":"2017年度下学期","startTime":"2017/09/01","endTime":"2018/01/30"}]

// 2.教室管理   /classroom/listSysClassroom

// 3.班级管理   /class/listSysClass

// 4.年级管理   /grade/listSysGrade

// 5.部门管理   /dept/listDept

// 学期管理
export function listSysSemester(params) {
  return request({
    url: '/semester/listSysSemester',
    method: 'get',
    params: params
  })
}

export function addSysSemester(params) {
  return request({
    url: '/semester/addSysSemester',
    method: 'post',
    data: params
  })
}

export function updateSysSemester(params) {
  return request({
    url: '/semester/updateSysSemester',
    method: 'post',
    data: params
  })
}

export function deleteSysSemester(params) {
  return request({
    url: '/semester/deleteSysSemester',
    method: 'post',
    data: params
  })
}

// 教室管理
export function listSysClassroom(params) {
  return request({
    url: '/classroom/listSysClassroom',
    method: 'get',
    params: params
  })
}

export function addSysClassroom(params) {
  return request({
    url: '/classroom/addSysClassroom',
    method: 'post',
    data: params
  })
}

export function updateSysClassroom(params) {
  return request({
    url: '/classroom/updateSysClassroom',
    method: 'post',
    data: params
  })
}

export function deleteSysClassroom(params) {
  return request({
    url: '/classroom/deleteSysClassroom',
    method: 'post',
    data: params
  })
}

// 班级管理
export function listSysClass(params) {
  return request({
    url: '/class/listSysClass',
    method: 'get',
    params: params
  })
}

export function addSysClass(params) {
  return request({
    url: '/class/addSysClass',
    method: 'post',
    data: params
  })
}

export function updateSysClass(params) {
  return request({
    url: '/class/updateSysClass',
    method: 'post',
    data: params
  })
}

export function deleteSysClass(params) {
  return request({
    url: '/class/deleteSysClass',
    method: 'post',
    data: params
  })
}

// 班级类型
export function listClassType(params) { // id
  return request({
    url: '/class/selectClassType',
    method: 'get',
    params: params
  })
}

export function addClassType(params) { // dictName
  return request({
    url: '/class/addClassType',
    method: 'post',
    data: params
  })
}

export function updateClassType(params) {
  return request({
    url: '/dict/updateDict',
    method: 'post',
    data: params
  })
}

export function deleteClassType(params) {
  return request({
    url: '/dict/deleteDict',
    method: 'post',
    data: params
  })
}

// 年级管理
export function listSysGrade(params) {
  return request({
    url: '/grade/listSysGrade',
    method: 'get',
    params: params
  })
}

export function listSysGradeAll(params) {
  return request({
    url: '/grade/listSysGradeAll',
    method: 'get',
    params: params
  })
}

export function addSysGrade(params) {
  return request({
    url: '/grade/addSysGrade',
    method: 'post',
    data: params
  })
}

export function updateSysGrade(params) {
  return request({
    url: '/grade/updateSysGrade',
    method: 'post',
    data: params
  })
}

export function deleteSysGrade(params) {
  return request({
    url: '/grade/deleteSysGrade',
    method: 'post',
    data: params
  })
}

// 部门管理
export function listDept(params) {
  return request({
    url: '/dept/listDept',
    method: 'get',
    params: params
  })
}

export function addDept(params) {
  return request({
    url: '/dept/addDept',
    method: 'post',
    data: params
  })
}

export function updateDept(params) {
  return request({
    url: '/dept/updateDept',
    method: 'post',
    data: params
  })
}

export function deleteDept(params) {
  return request({
    url: '/dept/deleteDept',
    method: 'post',
    data: params
  })
}

export function addUserByDeptId(params) {
  return request({
    url: '/dept/addUserByDeptId',
    method: 'post',
    data: params
  })
}

export function deleteUserByDeptId(params) {
  return request({
    url: '/dept/deleteUserByDeptId',
    method: 'post',
    data: params
  })
}

export function selectUserByDeptId(params) {
  return request({
    url: '/dept/selectUserByDeptId',
    method: 'post',
    data: params
  })
}
