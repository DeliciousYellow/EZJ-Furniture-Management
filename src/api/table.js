import request from '@/utils/request'

export function GetList(page,pageSize) {
  // console.log(page,pageSize)
  return request({
    url: `/Admin/GetFurnitureAllPage/${page}/${pageSize}`,
    method: 'get'
  })
}

export function GetAllTag() {
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

export function SaveMapping(furnitureId,arrTagId) {
  return request({
    url: `/Admin/SaveMapping`,
    method: 'post',
    data:{
      'furnitureId' : furnitureId,
      'arrTagId' : arrTagId
    }
  })
}