import request from '@/utils/request'

// 学校课程管理

// 课程管理  /course/listCourse  /course/addCourse   /course/updateCourse   /course/deleteCourse   /course/addCourseImages    /course/listCourseImages    /course/addCourseType

// 课程分类管理  /category/listNewCategory //四个都一样  查询所有分类 module 1.新闻 2.图片 3.视频  4.课程 5.活动 6.课程目录

// 课程类型管理 /course/listCourseType

// 课程管理  目录管理
export function listCourse(params) {
  return request({
    url: '/course/listCourse',
    method: 'get',
    params: params
  })
}

export function listCourseAll(params) {
  return request({
    url: '/course/listCourseAll',
    method: 'get',
    params: params
  })
}

export function addCourse(params) {
  return request({
    url: '/course/addCourse',
    method: 'post',
    data: params
  })
}

export function updateCourse(params) {
  return request({
    url: '/course/updateCourse',
    method: 'post',
    data: params
  })
}

export function deleteCourse(params) {
  return request({
    url: '/course/deleteCourse',
    method: 'post',
    data: params
  })
}

export function listCourseImages(params) { // 课程图片 list
  return request({
    url: '/course/listCourseImages',
    method: 'post',
    data: params
  })
}

export function addCourseImages(params) {
  return request({
    url: '/course/addCourseImages',
    method: 'post',
    data: params
  })
}

// 课程目录
export function listCatalog(params) {
  return request({
    url: '/catalog/listCatalog',
    method: 'post',
    data: params
  })
}

export function addCatalog(params) {
  return request({
    url: '/catalog/addCatalog',
    method: 'post',
    data: params
  })
}

export function updateCatalog(params) {
  return request({
    url: '/catalog/updateCatalog',
    method: 'post',
    data: params
  })
}

export function deleteCatalog(params) {
  return request({
    url: '/catalog/deleteCatalog',
    method: 'post',
    data: params
  })
}

// 课程分类管理
// /category/listNewCategory //四个都一样  查询所有分类 module 1.新闻 2.图片 3.视频  4.课程 5.活动
export function listNewCategory(params) {
  return request({
    url: '/category/listNewCategory',
    method: 'post',
    data: params
  })
}

export function addCategory(params) {
  return request({
    url: '/category/addCategory',
    method: 'post',
    data: params
  })
}

export function updateCategory(params) {
  return request({
    url: '/category/updateCategory',
    method: 'post',
    data: params
  })
}

export function deleteCategory(params) {
  return request({
    url: '/category/deleteCategory',
    method: 'post',
    data: params
  })
}

// 课程类型管理
export function listCourseType(params) {
  return request({
    url: '/course/listCourseType',
    method: 'get',
    params: params
  })
}

export function addCourseType(params) { //  pid dictName
  return request({
    url: '/course/addCourseType',
    method: 'post',
    data: params
  })
}

export function updateDict(params) { // 传参 id :xxx
  return request({
    url: '/dict/updateDict',
    method: 'post',
    data: params
  })
}

export function deleteDict(params) { // 传参 id :xxx
  return request({
    url: '/dict/deleteDict',
    method: 'post',
    data: params
  })
}

// 课时
export function listClassHour(params) { // 传参 courseId :xxx   根据id查课时
  return request({
    url: '/classHour/listClassHour',
    method: 'post',
    data: params
  })
}

export function addClassHour(params) {
  return request({
    url: '/classHour/addClassHour',
    method: 'post',
    data: params
  })
}

export function updateClassHour(params) {
  return request({
    url: '/classHour/updateClassHour',
    method: 'post',
    data: params
  })
}

export function deleteClassHour(params) {
  return request({
    url: '/classHour/deleteClassHour',
    method: 'post',
    data: params
  })
}
