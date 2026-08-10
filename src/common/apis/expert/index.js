import { request } from "@/http/axios"

/** 达人分页列表 */
export function getExpertListApi(data) {
  return request({
    url: "expert/list/page/vo",
    method: "post",
    data
  })
}

/** 达人详情 */
export function getExpertDetailApi(id) {
  return request({
    url: "expert/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增达人 */
export function createExpertApi(data) {
  return request({
    url: "expert/add",
    method: "post",
    data
  })
}

/** 更新达人 */
export function updateExpertApi(data) {
  return request({
    url: "expert/update",
    method: "post",
    data
  })
}

/** 删除达人 */
export function deleteExpertApi(id) {
  return request({
    url: `expert/delete/${id}`,
    method: "delete"
  })
}

/** 指定达人下的合作申请分页列表 */
export function getExpertCoopListByExpertApi(data) {
  return request({
    url: "expert/coop/list/page/vo",
    method: "post",
    data
  })
}
