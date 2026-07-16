import { request } from "@/http/axios"

/** 首页区块列表 */
export function getHomeSectionListApi() {
  return request({
    url: "homeSection/list",
    method: "get"
  })
}

/** 更新首页区块 */
export function updateHomeSectionApi(data) {
  return request({
    url: "homeSection/update",
    method: "post",
    data
  })
}
