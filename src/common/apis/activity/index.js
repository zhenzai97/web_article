import { request } from "@/http/axios"

/** 活动分页列表 */
export function getActivityListApi(data) {
  return request({
    url: "activity/list/page/vo",
    method: "post",
    data
  })
}

/** 活动详情 */
export function getActivityDetailApi(id) {
  return request({
    url: "activity/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增活动 */
export function createActivityApi(data) {
  return request({
    url: "activity/add",
    method: "post",
    data
  })
}

/** 更新活动 */
export function updateActivityApi(data) {
  return request({
    url: "activity/update",
    method: "post",
    data
  })
}

/** 删除活动 */
export function deleteActivityApi(id) {
  return request({
    url: `activity/delete/${id}`,
    method: "delete"
  })
}
