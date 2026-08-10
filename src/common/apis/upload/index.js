import { getToken } from "@@/utils/local-storage"
import { request } from "@/http/axios"

/** OSS 上传地址（供 el-upload action 场景使用） */
export const UPLOAD_OSS_URL = `${import.meta.env.VITE_BASE_URL}/upload/oss`

/** OSS 上传请求头 */
export function getUploadHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * 上传文件到 OSS
 * @param {File} file
 */
export function uploadOssApi(file) {
  const formData = new FormData()
  formData.append("file", file)

  return request({
    url: "upload/oss",
    method: "post",
    data: formData,
    timeout: 120000
  })
}

/**
 * 从上传响应中解析文件 URL
 * @param {unknown} data
 */
export function resolveUploadUrl(data) {
  if (typeof data === "string") {
    return data
  }
  if (data && typeof data === "object") {
    return data.url ?? data.path ?? data.fileUrl ?? data.link ?? ""
  }
  return ""
}
