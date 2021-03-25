import request from '@/utils/request'

// 新闻管理
// /new/listNew 参数：notifyObjectId //通知对象id
// /new/listNewAll
// /new/addNew
// /new/updateNew
// /new/deleteNew
// 参数： title,link,notifyObjectId,image,keywords,topCategoryId,activityLabel,description,content

// /new/listNewsReview //根据新闻id查询新闻评论 参数：newId
// /new

export function listNew(params) {
  return request({
    url: '/new/listNew',
    method: 'post',
    data: params
  })
}

export function listNewAll(params) {
  return request({
    url: '/new/listNewAll',
    method: 'get',
    params: params
  })
}

export function addNew(params) {
  return request({
    url: '/new/addNew',
    method: 'post',
    data: params
  })
}

export function updateNew(params) {
  return request({
    url: '/new/updateNew',
    method: 'post',
    data: params
  })
}

export function deleteNew(params) {
  return request({
    url: '/new/deleteNew',
    method: 'post',
    data: params
  })
}





export function listNewsReview(params) {
  return request({
    url: '/new/listNewsReview',
    method: 'post',
    data: params
  })
}
