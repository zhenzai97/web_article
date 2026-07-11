import { computed, ref, toValue, watch } from "vue"
import {
  createDefaultFilterLayout,
  loadSearchFormLayout,
  mergeFilterLayout,
  saveSearchFormLayout
} from "../utils/filter-layout"

/** 管理筛选项显示顺序与可见性 */
export function useFilterLayout(items, cacheKey) {
  const layout = ref([])

  function syncLayout() {
    const list = toValue(items)
    const key = toValue(cacheKey)
    const saved = key ? loadSearchFormLayout(key) : null
    layout.value = mergeFilterLayout(saved, list)
  }

  watch(
    () => [toValue(items), toValue(cacheKey)],
    syncLayout,
    { immediate: true, deep: true }
  )

  const visibleItems = computed(() => {
    const list = toValue(items)
    const itemMap = new Map(list.map(item => [item.value, item]))
    return layout.value
      .filter(entry => entry.visible)
      .map(entry => itemMap.get(entry.key))
      .filter(Boolean)
  })

  function applyLayout(nextLayout) {
    layout.value = nextLayout
    const key = toValue(cacheKey)
    if (key) {
      saveSearchFormLayout(key, nextLayout)
    }
  }

  function resetLayout() {
    layout.value = createDefaultFilterLayout(toValue(items))
    const key = toValue(cacheKey)
    if (key) {
      saveSearchFormLayout(key, layout.value)
    }
  }

  return {
    layout,
    visibleItems,
    applyLayout,
    resetLayout
  }
}
