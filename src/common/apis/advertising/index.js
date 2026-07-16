import { request } from "@/http/axios"

/** 运营广告分页列表 */
export function getAdvertisingListApi(data) {
  return request({
    url: "advertising/list/page/vo",
    method: "post",
    data
  })
}

/** 运营广告详情 */
export function getAdvertisingDetailApi(id) {
  return request({
    url: "advertising/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增运营广告 */
export function createAdvertisingApi(data) {
  return request({
    url: "advertising/add",
    method: "post",
    data
  })
}

/** 更新运营广告 */
export function updateAdvertisingApi(data) {
  return request({
    url: "advertising/update",
    method: "post",
    data
  })
}

/** 删除运营广告 */
export function deleteAdvertisingApi(id) {
  return request({
    url: `advertising/delete/${id}`,
    method: "delete"
  })
}
