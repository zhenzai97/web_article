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

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref([])
  const addRoutes = ref([])
  const menuRouteNames = ref([])

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

  /** 根据后端菜单生成可访问路由 */
  const setMenuRoutes = (menus, roles) => {
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
  }

  return { routes, addRoutes, menuRouteNames, setMenuRoutes, setRoutes, setAllRoutes, resetRoutes }
})

export function usePermissionStoreOutside() {
  return usePermissionStore(pinia)
}
