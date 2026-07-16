import { request } from "@/http/axios"

/** 文章分页列表 */
export function getArticleListApi(data) {
  return request({
    url: "article/list/page/vo",
    method: "post",
    data
  })
}

/** 文章详情 */
export function getArticleDetailApi(id) {
  return request({
    url: `article/get/${id}`,
    method: "get"
  })
}

/** 新增文章 */
export function createArticleApi(data) {
  return request({
    url: "article/add",
    method: "post",
    data
  })
}

/** 更新文章 */
export function updateArticleApi(data) {
  return request({
    url: "article/update",
    method: "put",
    data
  })
}

/** 删除文章 */
export function deleteArticleApi(id) {
  return request({
    url: `article/delete/${id}`,
    method: "delete"
  })
}

/** 批量删除文章 */
export function batchDeleteArticleApi(ids) {
  return request({
    url: "article/delete/batch",
    method: "delete",
    data: { ids }
  })
}

/** 发布文章 */
export function publishArticleApi(id) {
  return request({
    url: "article/publish",
    method: "put",
    data: { id }
  })
}

/** 下线文章 */
export function offlineArticleApi(id) {
  return request({
    url: "article/offline",
    method: "put",
    data: { id }
  })
}

/** 工作台概览数据（兼容旧调用，转发至 dashboard/overview） */
export function getArticleDashboardApi() {
  return request({
    url: "dashboard/overview",
    method: "get"
  })
}
