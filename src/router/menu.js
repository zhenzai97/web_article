import * as ElementPlusIconsVue from "@element-plus/icons-vue"

const Layouts = () => import("@/layouts/index.vue")

/** 页面组件模块映射 */
const pageModules = import.meta.glob("@/pages/**/*.vue")

/** 将后端菜单转为 Vue Router 路由 */
export function transformMenuToRoutes(menus) {
  return menus
    .filter(isValidMenu)
    .map(menu => menuToRoute(menu))
    .filter(Boolean)
}

/** 收集路由 name，用于登出时移除动态路由 */
export function collectRouteNames(routes) {
  const names = []
  routes.forEach((route) => {
    if (route.name) {
      names.push(route.name)
    }
    if (route.children?.length) {
      names.push(...collectRouteNames(route.children))
    }
  })
  return names
}

function isValidMenu(menu) {
  return menu.status === 1 && menu.visible === 1 && menu.menuType !== 3
}

function menuToRoute(menu) {
  const meta = buildRouteMeta(menu)
  const name = formatRouteName(menu.permCode, menu.path)

  // 目录
  if (menu.menuType === 1) {
    const children = (menu.children ?? [])
      .filter(isValidMenu)
      .map(child => menuChildToRoute(child, menu.path))
      .filter(Boolean)

    if (!children.length) {
      return null
    }

    return {
      path: menu.path,
      component: Layouts,
      redirect: children[0].path.startsWith("/") ? children[0].path : `${menu.path}/${children[0].path}`,
      name,
      meta: { ...meta, alwaysShow: true },
      children
    }
  }

  // 根级菜单（无父目录）
  if (menu.menuType === 2) {
    return {
      path: menu.path,
      component: Layouts,
      name,
      meta,
      children: [
        {
          path: "",
          component: resolvePageComponent(menu.component),
          name: `${name}Page`,
          meta
        }
      ]
    }
  }

  return null
}

function menuChildToRoute(menu, parentPath) {
  if (menu.menuType === 3) {
    return null
  }

  const meta = buildRouteMeta(menu)
  const name = formatRouteName(menu.permCode, menu.path)

  if (menu.menuType === 1) {
    return menuToRoute(menu)
  }

  return {
    path: getChildPath(menu.path, parentPath),
    component: resolvePageComponent(menu.component),
    name,
    meta
  }
}

function buildRouteMeta(menu) {
  const meta = {
    title: menu.menuName,
    hidden: menu.visible !== 1,
    keepAlive: menu.isCache === 1,
    permCode: menu.permCode
  }
  if (menu.icon && menu.icon in ElementPlusIconsVue) {
    meta.elIcon = menu.icon
  }
  return meta
}

/** permCode: system:user → SystemUser */
function formatRouteName(permCode, path) {
  if (permCode) {
    return permCode
      .split(/[:/]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  }
  return path
    .split("/")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

/** /system/user + /system → user */
function getChildPath(childPath, parentPath) {
  if (childPath.startsWith(`${parentPath}/`)) {
    return childPath.slice(parentPath.length + 1)
  }
  return childPath.replace(/^\//, "")
}

/** /system/user/index → @/pages/system/user/index.vue */
function resolvePageComponent(component) {
  if (!component || component === "/system" || component === "Layout") {
    return Layouts
  }

  const normalized = component.replace(/^\//, "").replace(/\/$/, "")
  const suffix = `/pages/${normalized}.vue`
  const moduleKey = Object.keys(pageModules).find(key => key.replace(/\\/g, "/").endsWith(suffix))

  if (!moduleKey) {
    console.warn(`[router] 组件未找到: ${component}`)
    return () => import("@/pages/error/404.vue")
  }

  return pageModules[moduleKey]
}
