import { request } from "@/http/axios"

/** 非洲翠专委会配置分页列表 */
export function getJadeCommitteeConfigListApi(data) {
  return request({
    url: "jadeCommitteeConfig/list/page/vo",
    method: "post",
    data
  })
}

/** 非洲翠专委会配置详情 */
export function getJadeCommitteeConfigDetailApi(id) {
  return request({
    url: "jadeCommitteeConfig/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增非洲翠专委会配置 */
export function createJadeCommitteeConfigApi(data) {
  return request({
    url: "jadeCommitteeConfig/add",
    method: "post",
    data
  })
}

/** 更新非洲翠专委会配置 */
export function updateJadeCommitteeConfigApi(data) {
  return request({
    url: "jadeCommitteeConfig/update",
    method: "post",
    data
  })
}

/** 删除非洲翠专委会配置 */
export function deleteJadeCommitteeConfigApi(id) {
  return request({
    url: `jadeCommitteeConfig/delete/${id}`,
    method: "delete"
  })
}
