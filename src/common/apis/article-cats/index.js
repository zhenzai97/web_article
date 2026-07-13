import { request } from "@/http/axios"

/** 栏目分页列表 */
export function getArticleCatListApi(data) {
  return request({
    url: "articleCat/list/page/vo",
    method: "post",
    data
  })
}

/** 全部启用栏目（下拉用） */
export function getArticleCatAllApi() {
  return request({
    url: "articleCat/list/allData",
    method: "get"
  })
}

/** 栏目详情 */
export function getArticleCatDetailApi(id) {
  return request({
    url: `articleCat/get/${id}`,
    method: "get"
  })
}

/** 新增栏目 */
export function createArticleCatApi(data) {
  return request({
    url: "articleCat/add",
    method: "post",
    data
  })
}

/** 更新栏目 */
export function updateArticleCatApi(data) {
  return request({
    url: "articleCat/update",
    method: "put",
    data
  })
}

/** 删除栏目 */
export function deleteArticleCatApi(id) {
  return request({
    url: `articleCat/delete/${id}`,
    method: "delete"
  })
}
