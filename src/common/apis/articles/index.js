import { getToken } from "@@/utils/local-storage"
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

/** 下载文章导入模板 */
export async function downloadArticleImportTemplateApi() {
  const baseURL = import.meta.env.VITE_BASE_URL || ""
  const prefix = baseURL.endsWith("/") ? baseURL : `${baseURL}/`
  const token = getToken()
  const res = await fetch(`${prefix}article/import/template`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) {
    throw new Error("模板下载失败")
  }
  const blob = await res.blob()
  const link = document.createElement("a")
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  link.download = "文章导入模板.xlsx"
  link.click()
  URL.revokeObjectURL(objectUrl)
}

/** 提交文章导入任务 */
export function importArticleApi(file) {
  const formData = new FormData()
  formData.append("file", file)
  return request({
    url: "article/import",
    method: "post",
    data: formData,
    timeout: 120000
  })
}

/** 提交文章导出任务 */
export function exportArticleApi(data) {
  return request({
    url: "article/export",
    method: "post",
    data,
    timeout: 30000
  })
}
