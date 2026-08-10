import { request } from "@/http/axios"

/** 非洲翠专委会分页列表 */
export function getJadeCommitteeListApi(data) {
  return request({
    url: "jadeCommittee/list/page/vo",
    method: "post",
    data
  })
}

/** 非洲翠专委会详情 */
export function getJadeCommitteeDetailApi(id) {
  return request({
    url: "jadeCommittee/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增非洲翠专委会 */
export function createJadeCommitteeApi(data) {
  return request({
    url: "jadeCommittee/add",
    method: "post",
    data
  })
}

/** 更新非洲翠专委会 */
export function updateJadeCommitteeApi(data) {
  return request({
    url: "jadeCommittee/update",
    method: "post",
    data
  })
}

/** 删除非洲翠专委会 */
export function deleteJadeCommitteeApi(id) {
  return request({
    url: `jadeCommittee/delete/${id}`,
    method: "delete"
  })
}
