import { request } from "@/http/axios"

/** 会员配置分页列表 */
export function getMemberConfigListApi(data) {
  return request({
    url: "memberConfig/list/page/vo",
    method: "post",
    data
  })
}

/** 会员配置详情 */
export function getMemberConfigDetailApi(id) {
  return request({
    url: "memberConfig/get/vo",
    method: "get",
    params: { id }
  })
}

/** 当前启用的会员配置 */
export function getCurrentMemberConfigApi() {
  return request({
    url: "memberConfig/current",
    method: "get"
  })
}

/** 新增会员配置 */
export function createMemberConfigApi(data) {
  return request({
    url: "memberConfig/add",
    method: "post",
    data
  })
}

/** 更新会员配置 */
export function updateMemberConfigApi(data) {
  return request({
    url: "memberConfig/update",
    method: "post",
    data
  })
}

/** 删除会员配置 */
export function deleteMemberConfigApi(id) {
  return request({
    url: `memberConfig/delete/${id}`,
    method: "delete"
  })
}
