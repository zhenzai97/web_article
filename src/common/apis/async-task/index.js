import { getToken } from "@@/utils/local-storage"
import { request } from "@/http/axios"

/** 我的异步任务分页 */
export function getMyAsyncTaskPageApi(data) {
  return request({
    url: "asyncTask/my/page",
    method: "post",
    data
  })
}

/** 异步任务详情 */
export function getAsyncTaskDetailApi(id) {
  return request({
    url: `asyncTask/${id}`,
    method: "get"
  })
}

/**
 * 下载任务文件（result | fail）
 * 使用原生 fetch + blob，避免 JSON 拦截器干扰
 */
export async function downloadAsyncTaskFileApi(id, file = "result") {
  const baseURL = import.meta.env.VITE_BASE_URL || ""
  const prefix = baseURL.endsWith("/") ? baseURL : `${baseURL}/`
  const token = getToken()
  const url = `${prefix}asyncTask/${id}/download?file=${encodeURIComponent(file)}`
  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) {
    throw new Error("下载失败")
  }
  const blob = await res.blob()
  const disposition = res.headers.get("Content-disposition") || ""
  let fileName = file === "fail" ? "导入失败明细.xlsx" : "任务结果.xlsx"
  const match = disposition.match(/filename\*=utf-8''([^;]+)|filename="?([^"]+)"?/i)
  if (match) {
    fileName = decodeURIComponent(match[1] || match[2])
  }
  const link = document.createElement("a")
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  link.download = fileName
  link.click()
  URL.revokeObjectURL(objectUrl)
}
