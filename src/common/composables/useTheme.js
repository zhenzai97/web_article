import { setCssVar } from "@@/utils/css"
import { getActiveThemeName, setActiveThemeName } from "@@/utils/local-storage"

const DEFAULT_THEME_NAME = "normal"

const themeList = [
  { title: "默认", name: DEFAULT_THEME_NAME },
  { title: "黑暗", name: "dark" },
  { title: "深蓝", name: "dark-blue" }
]

const activeThemeName = ref(getActiveThemeName() || DEFAULT_THEME_NAME)

function setTheme({ clientX, clientY }, value) {
  const maxRadius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  )
  setCssVar("--v3-theme-x", `${clientX}px`)
  setCssVar("--v3-theme-y", `${clientY}px`)
  setCssVar("--v3-theme-r", `${maxRadius}px`)
  const handler = () => {
    activeThemeName.value = value
  }
  document.startViewTransition ? document.startViewTransition(handler) : handler()
}

function addHtmlClass(value) {
  document.documentElement.classList.add(value)
}

function removeHtmlClass(value) {
  const otherThemeNameList = themeList.map(item => item.name).filter(name => name !== value)
  document.documentElement.classList.remove(...otherThemeNameList)
}

function initTheme() {
  watchEffect(() => {
    const value = activeThemeName.value
    removeHtmlClass(value)
    addHtmlClass(value)
    setActiveThemeName(value)
  })
}

export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme }
}
