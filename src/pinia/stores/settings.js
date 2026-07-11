import { setLayoutsConfig } from "@@/utils/local-storage"
import { layoutsConfig } from "@/layouts/config"
import { pinia } from "@/pinia"

export const useSettingsStore = defineStore("settings", () => {
  const state = {}

  const getCacheData = () => {
    const settings = {}
    for (const [key, value] of Object.entries(state)) {
      settings[key] = value.value
    }
    return settings
  }

  for (const [key, value] of Object.entries(layoutsConfig)) {
    const refValue = ref(value)
    state[key] = refValue
    watch(refValue, () => {
      const settings = getCacheData()
      setLayoutsConfig(settings)
    })
  }

  return state
})

export function useSettingsStoreOutside() {
  return useSettingsStore(pinia)
}
