import request from '@/utils/request'
import { SHA256 } from 'crypto-js'
import { getDigestSecret } from '@/utils/auth'

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
  const requestData = {
    'furnitureId' : furnitureId,
    'arrTagId' : arrTagId
  }
  const digestSecret = getDigestSecret()
  // console.log(JSON.stringify(requestData)+digestSecret)
  // console.log(digestSecret)
  // console.log(SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase())
  return request({
    url: `/Admin/SaveMapping`,
    method: 'post',
    headers:{
      'X-Digest': SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase()
    },
    data:requestData
  })
}
//添加标签
export function AddTag(formLabelAlign) {
  const requestData = {
    'tagName' : formLabelAlign.tagName,
    'tagType' : formLabelAlign.tagType
  }
  const digestSecret = getDigestSecret()
  // console.log(JSON.stringify(requestData)+digestSecret)
  // console.log(digestSecret)
  // console.log(SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase())
  return request({
    url: `/Admin/AddTag`,
    method: 'post',
    headers:{
      'X-Digest': SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase()
    },
    data:requestData
  })
}
//删除标签
export function DeleteTag(arrTagId) {
  const requestData = {
    'arrTagId' : arrTagId
  }
  const digestSecret = getDigestSecret()
  // console.log(JSON.stringify(requestData)+digestSecret)
  // console.log(digestSecret)
  // console.log(SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase())
  return request({
    url: `/Admin/DeleteTag`,
    method: 'delete',
    headers:{
      'X-Digest': SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase()
    },
    data:requestData
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
      'Content-Type': 'multipart/form-data',//文件上传需要设置该参数
    },
    data:formData
  })
}
//删除商品
export function DeleteFurniture(furnitureId) {
  const requestData = {
    "furnitureId" : furnitureId
  }
  const digestSecret = getDigestSecret()
  return request({
    url: `/Admin/DeleteFurniture`,
    method: 'delete',
    headers:{
      'X-Digest': SHA256(JSON.stringify(requestData)+digestSecret).toString().toUpperCase()
    },
    data:requestData
  })
}

//查询商品的详情图片
export function GetPictureById(furnitureId) {
  return request({
    url: `/GetPictureById/${furnitureId}`,
    method: 'get',
  })
}
//添加商品的详情图片
export function AddPictureById(formData) {
  return request({
    url: `/Admin/AddPictureById`,
    method: 'post',
    timeout: 1000000,//超时时间需要设置的较大，否则容易上传失败
    headers: {
      'Content-Type': 'multipart/form-data',//文件上传需要设置该参数
    },
    data:formData
  })
}

//获取分页获取订单信息
export function GetOrderAllPage(page,pageSize) {
  return request({
    url: `/Admin/GetOrderAllPage/${page}/${pageSize}`,
    method: 'get'
  })
}

//获取分页获取日志信息
export function GetLogAllPage(page,pageSize) {
  return request({
    url: `/Admin/GetLogAllPage/${page}/${pageSize}`,
    method: 'get'
  })
}