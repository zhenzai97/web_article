import { getCurrentUserApi } from "@@/apis/users"
import { setToken as _setToken, getToken, removeToken } from "@@/utils/local-storage"
import { pinia } from "@/pinia"
import { resetRouter } from "@/router"
import { routerConfig } from "@/router/config"
import { useSettingsStore } from "./settings"
import { useTagsViewStore } from "./tags-view"

export const useUserStore = defineStore("user", () => {
  const token = ref(getToken() || "")

  const roles = ref([])

  const username = ref("")

  const tagsViewStore = useTagsViewStore()

  const settingsStore = useSettingsStore()

  // 设置 Token
  const setToken = (value) => {
    _setToken(value)
    token.value = value
  }

  // 获取用户详情
  const getInfo = async () => {
    const { data } = await getCurrentUserApi()
    username.value = data.userName || data.username || ""
    if (data.roles?.length > 0) {
      roles.value = data.roles
    } else if (data.userRole) {
      roles.value = [data.userRole]
    } else {
      roles.value = routerConfig.defaultRoles
    }
  }

  // 模拟角色变化
  const changeRoles = (role) => {
    const newToken = `token-${role}`
    token.value = newToken
    _setToken(newToken)
    // 用刷新页面代替重新登录
    location.reload()
  }

  // 重置 Visited Views 和 Cached Views
  const resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  // 登出
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    resetTagsView()
  }

  // 重置 Token
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { token, roles, username, setToken, getInfo, changeRoles, logout, resetToken }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useUserStoreOutside() {
  return useUserStore(pinia)
}
