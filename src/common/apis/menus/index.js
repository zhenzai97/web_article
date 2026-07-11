import { request } from "@/http/axios"

/** 新增菜单 */
export function createMenuApi(data) {
  return request({
    url: "menu/add",
    method: "post",
    data
  })
}

/** 删除菜单 */
export function deleteMenuApi(id) {
  return request({
    url: `menu/delete/${id}`,
    method: "delete"
  })
}

/** 修改菜单 */
export function updateMenuApi(data) {
  return request({
    url: "menu/update",
    method: "post",
    data
  })
}

/** 查询菜单树 */
export function getMenuTreeApi() {
  return request({
    url: "menu/list/tree/vo",
    method: "get"
  })
}
