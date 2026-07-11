const SYSTEM_NAME = "v3-admin-vite"

/** 缂撳瓨鏁版嵁鏃剁敤鍒扮殑 Key */
export class CacheKey {
  static TOKEN = `${SYSTEM_NAME}-token-key`
  static CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
  static SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  static CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`
}
