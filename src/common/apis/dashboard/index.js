import { request } from "@/http/axios"

/** 工作台聚合概览 */
export function getDashboardOverviewApi() {
  return request({
    url: "dashboard/overview",
    method: "get"
  })
}
