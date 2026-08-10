import { request } from "@/http/axios"

/** 达人申请分页列表 */
export function getExpertApplyListApi(data) {
  return request({
    url: "expertApply/list/page/vo",
    method: "post",
    data
  })
}

/** 达人申请详情 */
export function getExpertApplyDetailApi(id) {
  return request({
    url: "expertApply/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增达人申请 */
export function createExpertApplyApi(data) {
  return request({
    url: "expertApply/add",
    method: "post",
    data
  })
}

/** 更新达人申请 */
export function updateExpertApplyApi(data) {
  return request({
    url: "expertApply/update",
    method: "post",
    data
  })
}

/** 删除达人申请 */
export function deleteExpertApplyApi(id) {
  return request({
    url: `expertApply/delete/${id}`,
    method: "delete"
  })
}
