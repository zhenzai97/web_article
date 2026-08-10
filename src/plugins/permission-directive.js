import { isArray } from "@@/utils/validate"
import { checkPermission } from "@@/utils/permission"

/**
 * 权限指令：按菜单 permCode 控制按钮显隐
 * 用法：
 *   v-permission="'content:article:add'"
 *   v-permission="['content:article:edit', 'content:article:delete']"
 */
const permission = {
  mounted(el, binding) {
    applyPermission(el, binding)
  },
  updated(el, binding) {
    applyPermission(el, binding)
  }
}

function applyPermission(el, binding) {
  const { value } = binding
  if (value == null || value === "") {
    return
  }
  if (typeof value !== "string" && !(isArray(value) && value.length > 0)) {
    throw new Error("v-permission 参数须为字符串或非空数组，如 v-permission=\"'system:user:add'\"")
  }
  if (!checkPermission(value)) {
    el.parentNode?.removeChild(el)
  }
}

export function installPermissionDirective(app) {
  app.directive("permission", permission)
}
