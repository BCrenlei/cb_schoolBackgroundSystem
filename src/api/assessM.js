import request from '@/utils/request'
// 课程评语管理


// 老师评语以及学生评价管理类
// /evaluation/listStEvaluation
// /evaluation/addTEvaluation
// /evaluation/addSEvaluation
// /evaluation/updateStEvaluation
// /evaluation/deleteStEvaluation


export function listStEvaluation(params) { // 老师感悟学生评语 列表  一个字段不同
  return request({
    url: '/evaluation/listStEvaluation',
    method: 'get',
    params: params
  })
}

// 我的列表 老师评语管理：/evaluation/myListStEvaluation
export function myListStEvaluation(params) {
  return request({
    url: '/evaluation/myListStEvaluation',
    method: 'get',
    params: params
  })
}

export function addTEvaluation(params) { // 添加老师感悟
  return request({
    url: 'evaluation/addTEvaluation',
    method: 'post',
    data: params
  })
}

export function addSEvaluation(params) { // 添加学生评语 
  return request({
    url: 'evaluation/addSEvaluation',
    method: 'post',
    data: params
  })
}

export function updateStEvaluation(params) { // 更新 老师感悟学生评语 
  return request({
    url: '/evaluation/updateStEvaluation',
    method: 'post',
    data: params
  })
}

export function deleteStEvaluation(params) { //删除 老师感悟学生评语
  return request({
    url: '/evaluation/deleteStEvaluation',
    method: 'post',
    data: params
  })
}
