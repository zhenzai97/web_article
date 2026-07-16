import { request } from "@/http/axios"

/** 文旅内容分页列表 */
export function getTourismContentListApi(data) {
  return request({
    url: "tourismContent/list/page/vo",
    method: "post",
    data
  })
}

/** 文旅内容详情 */
export function getTourismContentDetailApi(id) {
  return request({
    url: "tourismContent/get/vo",
    method: "get",
    params: { id }
  })
}

/** 新增文旅内容 */
export function createTourismContentApi(data) {
  return request({
    url: "tourismContent/add",
    method: "post",
    data
  })
}

/** 更新文旅内容 */
export function updateTourismContentApi(data) {
  return request({
    url: "tourismContent/update",
    method: "post",
    data
  })
}

/** 删除文旅内容 */
export function deleteTourismContentApi(id) {
  return request({
    url: `tourismContent/delete/${id}`,
    method: "delete"
  })
}
