import { request } from "@/http/axios"

/** 增 */
export function createTableDataApi(data) {
  return request({
    url: "tables",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id) {
  return request({
    url: `tables/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data) {
  return request({
    url: "tables",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params) {
  return request({
    url: "tables",
    method: "get",
    params
  })
}
