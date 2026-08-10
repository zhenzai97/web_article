import { request } from "@/http/axios"

/** 行业报告分页列表 */
export function getIndustryReportListApi(data) {
  return request({
    url: "industryReport/list/page/vo",
    method: "post",
    data
  })
}

/** 行业报告详情 */
export function getIndustryReportDetailApi(id) {
  return request({
    url: "industryReport/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增行业报告 */
export function createIndustryReportApi(data) {
  return request({
    url: "industryReport/add",
    method: "post",
    data
  })
}

/** 更新行业报告 */
export function updateIndustryReportApi(data) {
  return request({
    url: "industryReport/update",
    method: "post",
    data
  })
}

/** 删除行业报告 */
export function deleteIndustryReportApi(id) {
  return request({
    url: `industryReport/delete/${id}`,
    method: "delete"
  })
}
