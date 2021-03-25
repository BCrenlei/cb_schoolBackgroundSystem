import request from '@/utils/request'

// 能力模块接口 带分页的列表
export function listAbility(params) {
  return request({
    url: '/ability/listAbility',
    method: 'get',
    params: params
  })
}

export function listAbilityAll(params) { // 传categoryId
  return request({
    url: '/ability/listAbilityAll',
    method: 'post',
    data: params
  })
}

// 能力类别额外接口
export function listNewCategory(params) {
  return request({
    url: '/category/listNewCategory',
    method: 'post',
    data: params
  })
}

// 新增能力
export function addAbility(params) {
  return request({
    url: '/ability/addAbility',
    method: 'post',
    data: params
  })
}
// 删除能力
export function deleteAbility(params) {
  return request({
    url: '/ability/deleteAbility',
    method: 'post',
    data: params
  })
}
// 更新能力
export function updateAbility(params) {
  return request({
    url: '/ability/updateAbility',
    method: 'post',
    data: params
  })
}
// 年级列表
export function listSysGrade(params) {
  return request({
    url: '/grade/listSysGrade',
    method: 'get',
    params: params
  })
}

// 课程列表接口
export function listCourse(params) {
  return request({
    url: '/course/listCourse',
    method: 'get',
    params: params
  })
}

// 能力类别列表
export function listAbilityCategory(params) {
  return request({
    url: '/abilityCategory/listAbilityCategory',
    method: 'get',
    params: params
  })
}

export function listAbilityCategoryAll(params) {
  return request({
    url: '/abilityCategory/listAbilityCategoryAll',
    method: 'post',
    data: params
  })
}

// 能力类别删除
export function deleteAbilityCategory(params) {
  return request({
    url: '/abilityCategory/deleteAbilityCategory',
    method: 'post',
    data: params
  })
}

// 能力类别更新
export function updateAbilityCategory(params) {
  return request({
    url: '/abilityCategory/updateAbilityCategory',
    method: 'post',
    data: params
  })
}

// 能力类别新增
export function addAbilityCategory(params) {
  return request({
    url: '/abilityCategory/addAbilityCategory',
    method: 'post',
    data: params
  })
}
