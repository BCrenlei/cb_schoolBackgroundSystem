import request from '@/utils/request'
// 成绩设置


// 成绩列表 /score/listCourseScore
export function listCourseScore(params) {
  return request({
    url: '/score/listCourseScore',
    method: 'get',
    params: params
  })
}

// 我的 成绩列表：/score/myListCourseScore
export function myListCourseScore(params) {
  return request({
    url: '/score/myListCourseScore',
    method: 'get',
    params: params
  })
}

export function addCourseScore(params) {
  return request({
    url: '/score/addCourseScore',
    method: 'post',
    data: params
  })
}

export function batchAddCourseScore(params) { // 批量增加成绩
  return request({
    url: '/score/batchAddCourseScore',
    method: 'post',
    data: params
  })
}

export function updateCourseScore(params) {
  return request({
    url: '/score/updateCourseScore',
    method: 'post',
    data: params
  })
}

export function deleteCourseScore(params) {
  return request({
    url: '/score/deleteCourseScore',
    method: 'post',
    data: params
  })
}

// 分数设置
export function listScoreRules(params) {
  return request({
    url: '/scoreRules/listScoreRules',
    method: 'get',
    params: params
  })
}

export function addScoreRules(params) {
  return request({
    url: '/scoreRules/addScoreRules',
    method: 'post',
    data: params
  })
}

export function updateScoreRules(params) {
  return request({
    url: '/scoreRules/updateScoreRules',
    method: 'post',
    data: params
  })
}

export function deleteScoreRules(params) {
  return request({
    url: '/scoreRules/deleteScoreRules',
    method: 'post',
    data: params
  })
}

