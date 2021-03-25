import request from '@/utils/request'

// 根据年级找班级 /class/selectClassByGradeId  gradeId
export function selectClass(params) {
  return request({
    url: '/class/selectClassByGradeId',
    method: 'post',
    data: params
  })
}

// 根据年级找课程 /course/selectCourseByGradeId  gradeId    可选参数 categoryId
export function selectCourse(params) {
  return request({
    url: '/course/selectCourseByGradeId',
    method: 'post',
    data: params
  })
}

// 课程分类 /course/listCourseType
export function listCourseType(params) {
  return request({
    url: '/course/listCourseType',
    method: 'post',
    data: params
  })
}

// 查询课时
export function selectClassHourByCourseId(params) {
  return request({
    url: '/classHour/selectClassHourByCourseId',
    method: 'post',
    data: params
  })
}

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

// 查课程
export function selectCourseByGradeId(params) {
  return request({
    url: '/course/selectCourseByGradeId',
    method: 'post',
    data: params
  })
}

// 班级查学生 /student/selectStudentByClassId
export function selectStudentByClassId(params) {
  return request({
    url: '/student/selectStudentByClassId',
    method: 'post',
    data: params
  })
}

// 根据班级id查询班级老师 /teacher/selectTeacherByClassId
export function selectTea(params) {
  return request({
    url: '/teacher/selectTeacherByClassId',
    method: 'post',
    data: params
  })
}

// 根据班级id查询班级学生 /student/selectStudentByClassId
export function selectStu(params) {
  return request({
    url: '/student/selectStudentByClassId',
    method: 'post',
    data: params
  })
}

// 根据班级id添加任课老师 /teacher/addTeacherByClassId
export function addTeaByClassId(params) {
  return request({
    url: '/teacher/addTeacherByClassId',
    method: 'post',
    data: params
  })
}

// 根据班级id删除任课老师 /teacher/deleteTeacherByClassId
export function delTeaByClassId(params) {
  return request({
    url: '/teacher/deleteTeacherByClassId',
    method: 'post',
    data: params
  })
}

// 根据班级id和课程id 查学生 /apply/selectUserApplyById   // classId,courseId
export function selectUserApplyById(params) {
  return request({
    url: '/apply/selectUserApplyById',
    method: 'post',
    data: params
  })
}

export function getToken() {
  return request({
    url: 'getToken',
    method: 'post',
    data: { 'surroundings': 'dev' }
    // data: { 'surroundings': 'prod' }
  })
}
