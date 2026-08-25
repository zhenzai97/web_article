import { request } from "@/http/axios"

/** 获取项目基础配置（单条对象） */
export function getProjectConfigApi() {
  return request({
    url: "projectConfig/get",
    method: "get"
  })
}

/** 更新项目基础配置 */
export function updateProjectConfigApi(data) {
  return request({
    url: "projectConfig/update",
    method: "post",
    data
  })
}
