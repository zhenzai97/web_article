import { LayoutModeEnum } from "@@/constants/app-key"
import { getLayoutsConfig } from "@@/utils/local-storage"

/** 项目配置类型 */

/** 默认配置 */
const DEFAULT_CONFIG = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showGreyMode: false,
  showColorWeakness: false
}

/** 项目配置 */
export const layoutsConfig = { ...DEFAULT_CONFIG, ...getLayoutsConfig() }
