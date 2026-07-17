import { request } from "@/http/axios"

/** 会员单位分页列表 */
export function getCompanyListApi(data) {
  return request({
    url: "company/list/page/vo",
    method: "post",
    data
  })
}

/** 会员单位详情 */
export function getCompanyDetailApi(id) {
  return request({
    url: "company/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增会员单位（管理端） */
export function createCompanyApi(data) {
  return request({
    url: "company/add",
    method: "post",
    data
  })
}

/** 更新会员单位 */
export function updateCompanyApi(data) {
  return request({
    url: "company/update",
    method: "post",
    data
  })
}

/** 删除会员单位 */
export function deleteCompanyApi(id) {
  return request({
    url: `company/delete/${id}`,
    method: "delete"
  })
}
