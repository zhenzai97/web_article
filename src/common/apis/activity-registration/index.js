import { request } from "@/http/axios"

/** 活动报名分页 */
export function getActivityRegistrationListApi(data) {
  return request({
    url: "activityRegistration/list/page/vo",
    method: "post",
    data
  })
}

/** 删除报名 */
export function deleteActivityRegistrationApi(id) {
  return request({
    url: `activityRegistration/delete/${id}`,
    method: "delete"
  })
}
