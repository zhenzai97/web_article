import { request } from "@/http/axios"

/** 专委会分页列表 */
export function getCommitteeListApi(data) {
  return request({
    url: "committee/list/page/vo",
    method: "post",
    data
  })
}

/** 专委会详情 */
export function getCommitteeDetailApi(id) {
  return request({
    url: "committee/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增专委会 */
export function createCommitteeApi(data) {
  return request({
    url: "committee/add",
    method: "post",
    data
  })
}

/** 更新专委会 */
export function updateCommitteeApi(data) {
  return request({
    url: "committee/update",
    method: "post",
    data
  })
}

/** 删除专委会 */
export function deleteCommitteeApi(id) {
  return request({
    url: `committee/delete/${id}`,
    method: "delete"
  })
}
