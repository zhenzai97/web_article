import { request } from "@/http/axios"

/** 获取当前登录用户详情 */
export function getCurrentUserApi() {
  return request({
    url: "user/get/login",
    method: "get"
  })
}

/** 新增用户 */
export function createUserApi(data) {
  return request({
    url: "user/add",
    method: "post",
    data
  })
}

/** 删除用户 */
export function deleteUserApi(id) {
  return request({
    url: `user/delete/${id}`,
    method: "delete"
  })
}

/** 修改用户 */
export function updateUserApi(data) {
  return request({
    url: "user/update",
    method: "put",
    data
  })
}

/** 查询用户列表 */
export function getUserListApi(data) {
  return request({
    url: "user/list/page/vo",
    method: "post",
    data
  })
}
