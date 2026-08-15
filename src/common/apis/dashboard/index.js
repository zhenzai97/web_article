import { request } from "@/http/axios"

/** 工作台聚合概览 */
export function getDashboardOverviewApi() {
  return request({
    url: "dashboard/overview",
    method: "get"
  })
}

/** 文章新增趋势：week / month / quarter / year */
export function getDashboardTrendApi(range = "week") {
  return request({
    url: "dashboard/trend",
    method: "get",
    params: { range }
  })
}
