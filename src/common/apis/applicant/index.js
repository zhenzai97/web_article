import { request } from "@/http/axios"

/** 应聘分页列表 */
export function getApplicantListApi(data) {
  return request({
    url: "applicant/list/page/vo",
    method: "post",
    data
  })
}

/** 应聘详情 */
export function getApplicantDetailApi(id) {
  return request({
    url: "applicant/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增应聘 */
export function createApplicantApi(data) {
  return request({
    url: "applicant/add",
    method: "post",
    data
  })
}

/** 更新应聘 */
export function updateApplicantApi(data) {
  return request({
    url: "applicant/update",
    method: "post",
    data
  })
}

/** 删除应聘 */
export function deleteApplicantApi(id) {
  return request({
    url: `applicant/delete/${id}`,
    method: "delete"
  })
}
