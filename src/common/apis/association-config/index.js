import { request } from "@/http/axios"

/** 协会配置分页列表 */
export function getAssociationConfigListApi(data) {
  return request({
    url: "associationConfig/list/page/vo",
    method: "post",
    data
  })
}

/** 协会配置详情 */
export function getAssociationConfigDetailApi(id) {
  return request({
    url: "associationConfig/get/vo",
    method: "get",
    params: { id }
  })
}

/** 当前启用的协会配置 */
export function getCurrentAssociationConfigApi() {
  return request({
    url: "associationConfig/current",
    method: "get"
  })
}

/** 新增协会配置 */
export function createAssociationConfigApi(data) {
  return request({
    url: "associationConfig/add",
    method: "post",
    data
  })
}

/** 更新协会配置 */
export function updateAssociationConfigApi(data) {
  return request({
    url: "associationConfig/update",
    method: "post",
    data
  })
}

/** 删除协会配置 */
export function deleteAssociationConfigApi(id) {
  return request({
    url: `associationConfig/delete/${id}`,
    method: "delete"
  })
}
