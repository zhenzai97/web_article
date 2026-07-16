import { request } from "@/http/axios"

/** 运营位分页列表 */
export function getAdvertisingSpaceListApi(data) {
  return request({
    url: "advertisingSpace/list/page/vo",
    method: "post",
    data
  })
}

/** 全部启用运营位（下拉用） */
export function getAdvertisingSpaceAllApi() {
  return request({
    url: "advertisingSpace/list/allData",
    method: "get"
  })
}

/** 新增运营位 */
export function createAdvertisingSpaceApi(data) {
  return request({
    url: "advertisingSpace/add",
    method: "post",
    data
  })
}

/** 更新运营位 */
export function updateAdvertisingSpaceApi(data) {
  return request({
    url: "advertisingSpace/update",
    method: "post",
    data
  })
}

/** 删除运营位 */
export function deleteAdvertisingSpaceApi(id) {
  return request({
    url: `advertisingSpace/delete/${id}`,
    method: "delete"
  })
}
