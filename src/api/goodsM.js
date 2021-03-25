import request from '@/utils/request'

export function listGoods(params) {
    return request({
      url: '/goods/listGoods',
      method: 'post',
      data: params
    })
  }