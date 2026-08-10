import { request } from "@/http/axios"

/** 非洲翠资源分页列表 */
export function getJadeResourceListApi(data) {
  return request({
    url: "jadeResource/list/page/vo",
    method: "post",
    data
  })
}

/** 非洲翠资源详情 */
export function getJadeResourceDetailApi(id) {
  return request({
    url: "jadeResource/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增非洲翠资源 */
export function createJadeResourceApi(data) {
  return request({
    url: "jadeResource/add",
    method: "post",
    data
  })
}

/** 更新非洲翠资源 */
export function updateJadeResourceApi(data) {
  return request({
    url: "jadeResource/update",
    method: "post",
    data
  })
}

/** 删除非洲翠资源 */
export function deleteJadeResourceApi(id) {
  return request({
    url: `jadeResource/delete/${id}`,
    method: "delete"
  })
}
