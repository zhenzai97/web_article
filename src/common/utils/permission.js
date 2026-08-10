import { isArray } from "@@/utils/validate"
import { usePermissionStore } from "@/pinia/stores/permission"
import { useUserStore } from "@/pinia/stores/user"

/** 超级管理员角色标识（拥有全部权限） */
const SUPER_ROLES = ["admin"]

/**
 * 判断是否拥有指定权限码（任一命中即可）
 * @param {string|string[]} value permCode 或数组
 */
export function checkPermission(value) {
  const codes = normalizeCodes(value)
  if (!codes.length) {
    console.error("checkPermission 参数无效，参考：checkPermission('content:article:add') 或 checkPermission(['a','b'])")
    return false
  }

  const userStore = useUserStore()
  // 超级管理员放行
  if (userStore.roles.some(role => SUPER_ROLES.includes(role))) {
    return true
  }
  // 兼容旧写法：直接按角色码判断（如 'admin' / 'editor'）
  if (codes.some(code => userStore.roles.includes(code))) {
    return true
  }

  const { permissions } = usePermissionStore()
  if (!permissions?.length) {
    return false
  }
  return codes.some(code => permissions.includes(code))
}

/**
 * 是否具备全部权限码
 * @param {string|string[]} value
 */
export function checkPermissionAll(value) {
  const codes = normalizeCodes(value)
  if (!codes.length) return false
  const userStore = useUserStore()
  if (userStore.roles.some(role => SUPER_ROLES.includes(role))) {
    return true
  }
  const { permissions } = usePermissionStore()
  return codes.every(code => permissions.includes(code))
}

function normalizeCodes(value) {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : []
  }
  if (isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }
  return []
}
