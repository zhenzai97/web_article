import { request } from "@/http/axios"

/** 非洲翠专委会申请分页列表 */
export function getJadeCommitteeApplyListApi(data) {
  return request({
    url: "jadeCommitteeApply/list/page/vo",
    method: "post",
    data
  })
}

/** 非洲翠专委会申请详情 */
export function getJadeCommitteeApplyDetailApi(id) {
  return request({
    url: "jadeCommitteeApply/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增非洲翠专委会申请 */
export function createJadeCommitteeApplyApi(data) {
  return request({
    url: "jadeCommitteeApply/add",
    method: "post",
    data
  })
}

/** 更新非洲翠专委会申请 */
export function updateJadeCommitteeApplyApi(data) {
  return request({
    url: "jadeCommitteeApply/update",
    method: "post",
    data
  })
}

/** 删除非洲翠专委会申请 */
export function deleteJadeCommitteeApplyApi(id) {
  return request({
    url: `jadeCommitteeApply/delete/${id}`,
    method: "delete"
  })
}
