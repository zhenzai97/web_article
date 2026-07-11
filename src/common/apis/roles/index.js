import { request } from "@/http/axios"

/** 新增角色 */
export function createRoleApi(data) {
  return request({
    url: "role/add",
    method: "post",
    data
  })
}

/** 删除角色 */
export function deleteRoleApi(id) {
  return request({
    url: `role/delete/${id}`,
    method: "delete"
  })
}

/** 修改角色 */
export function updateRoleApi(data) {
  return request({
    url: "role/update",
    method: "post",
    data
  })
}

/** 查询角色列表 */
export function getRoleListApi(data) {
  return request({
    url: "role/list/page/vo",
    method: "post",
    data
  })
}
