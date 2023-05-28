import request from '@/utils/request'

export function getList(page,pageSize) {
  console.log(page,pageSize)
  return request({
    url: `/Admin/GetFurnitureAllPage/${page}/${pageSize}`,
    method: 'get'
  })
}

export function getAllTag() {
  return request({
    url: '/Admin/GetTagAll',
    method: 'get'
  })
}

export function GetTagById(id) {
  return request({
    url: `/Admin/GetTagById/${id}`,
    method: 'get'
  })
}