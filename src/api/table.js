import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Admin/GetTable',
    method: 'get',
    params
  })
}
