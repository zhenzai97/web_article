import { pinia } from "@/pinia"
import { constantRoutes, dynamicRoutes } from "@/router"
import { routerConfig } from "@/router/config"
import { flatMultiLevelRoutes } from "@/router/helper"
import { collectRouteNames, transformMenuToRoutes } from "@/router/menu"

function hasPermission(roles, route) {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some(role => routeRoles.includes(role)) : true
}

function filterDynamicRoutes(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

/** 从菜单树收集 permCode（含按钮 menuType=3） */
function collectPermCodes(menus = [], result = []) {
  menus.forEach((menu) => {
    if (menu?.permCode) {
      result.push(String(menu.permCode).trim())
    }
    if (menu?.children?.length) {
      collectPermCodes(menu.children, result)
    }
  })
  return [...new Set(result.filter(Boolean))]
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref([])
  const addRoutes = ref([])
  const menuRouteNames = ref([])
  /** 当前用户拥有的权限码（来自菜单树 permCode） */
  const permissions = ref([])

  const set = (accessedRoutes) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  /** @deprecated 保留兼容，请使用 setMenuRoutes */
  const setRoutes = (roles) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles)
    set(accessedRoutes)
  }

  const setAllRoutes = () => {
    set(dynamicRoutes)
  }

  /** 根据后端菜单生成可访问路由，并缓存权限码 */
  const setMenuRoutes = (menus, roles) => {
    permissions.value = collectPermCodes(menus)
    const menuRoutes = transformMenuToRoutes(menus)
    const demoRoutes = routerConfig.dynamic ? filterDynamicRoutes(dynamicRoutes, roles) : []
    const accessedRoutes = [...menuRoutes, ...demoRoutes]
    menuRouteNames.value = collectRouteNames(menuRoutes)
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routerConfig.thirdLevelRouteCache
      ? flatMultiLevelRoutes(accessedRoutes)
      : accessedRoutes
  }

  const resetRoutes = () => {
    routes.value = []
    addRoutes.value = []
    menuRouteNames.value = []
    permissions.value = []
  }

  return {
    routes,
    addRoutes,
    menuRouteNames,
    permissions,
    setMenuRoutes,
    setRoutes,
    setAllRoutes,
    resetRoutes
  }
})

export function usePermissionStoreOutside() {
  return usePermissionStore(pinia)
}
