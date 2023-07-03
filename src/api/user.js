import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/AdminLogin',
    method: 'post',
    data
  })
}

//请求当前管理员信息
export function getInfo(token) {
  return request({
    url: '/Admin/GetInfo',
    method: 'get',
    params: { token }
  })
}

//退出登录
export function logout() {
  return request({
    url: 'AdminLogout',
    method: 'post'
  })
}