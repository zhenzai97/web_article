import { request } from "@/http/axios"

/** 招聘分页列表 */
export function getRecruitmentListApi(data) {
  return request({
    url: "recruitment/list/page/vo",
    method: "post",
    data
  })
}

/** 招聘详情 */
export function getRecruitmentDetailApi(id) {
  return request({
    url: "recruitment/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增招聘 */
export function createRecruitmentApi(data) {
  return request({
    url: "recruitment/add",
    method: "post",
    data
  })
}

/** 更新招聘 */
export function updateRecruitmentApi(data) {
  return request({
    url: "recruitment/update",
    method: "post",
    data
  })
}

/** 删除招聘 */
export function deleteRecruitmentApi(id) {
  return request({
    url: `recruitment/delete/${id}`,
    method: "delete"
  })
}
