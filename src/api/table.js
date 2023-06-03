import request from '@/utils/request'

//分页查询商品信息
export function GetList(page,pageSize) {
  return request({
    url: `/Admin/GetFurnitureAllPage/${page}/${pageSize}`,
    method: 'get'
  })
}
//查询所有的标签
export function GetAllTag() {
  return request({
    url: '/Admin/GetTagAll',
    method: 'get'
  })
}
//根据商品ID查询它拥有的标签
export function GetTagById(id) {
  return request({
    url: `/Admin/GetTagById/${id}`,
    method: 'get'
  })
}
//保存商品和标签的映射关系
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
//添加标签
export function AddTag(formLabelAlign) {
  console.log(formLabelAlign)
  return request({
    url: `/Admin/AddTag`,
    method: 'post',
    data:{
      'tagName' : formLabelAlign.tagName,
      'tagType' : formLabelAlign.tagType
    }
  })
}
//删除标签
export function DeleteTag(arrTagId) {
  return request({
    url: `/Admin/DeleteTag`,
    method: 'delete',
    data:{
      'arrTagId' : arrTagId
    }
  })
}
//添加商品
export function AddFurniture(formData) {
  // console.log(formData)
  return request({
    url: `/Admin/AddFurniture`,
    method: 'post',
    timeout: 1000000,//超时时间需要设置的较大，否则容易上传失败
    headers: {
      'Content-Type': 'multipart/form-data'//文件上传需要设置该参数
    },
    data:formData
  })
}
//删除商品
export function DeleteFurniture(furnitureId) {
  console.log(furnitureId)
  return request({
    url: `/Admin/DeleteFurniture`,
    method: 'delete',
    data:{
      'furnitureId': furnitureId
    }
  })
}