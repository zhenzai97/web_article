/** 生成默认筛选项布局 */
export function createDefaultFilterLayout(items) {
  return items.map(item => ({
    key: item.value,
    visible: item.visible !== false
  }))
}

/** 合并缓存布局与当前筛选项定义 */
export function mergeFilterLayout(savedLayout, items) {
  if (!savedLayout?.length) {
    return createDefaultFilterLayout(items)
  }

  const itemKeySet = new Set(items.map(item => item.value))
  const merged = savedLayout.filter(entry => itemKeySet.has(entry.key))
  const mergedKeySet = new Set(merged.map(entry => entry.key))

  for (const item of items) {
    if (!mergedKeySet.has(item.value)) {
      merged.push({
        key: item.value,
        visible: item.visible !== false
      })
    }
  }

  return merged
}

export function getSearchFormLayoutCacheKey(cacheKey) {
  return `search-form-layout-${cacheKey}`
}

export function loadSearchFormLayout(cacheKey) {
  if (!cacheKey) return null
  try {
    const json = localStorage.getItem(getSearchFormLayoutCacheKey(cacheKey))
    return json ? JSON.parse(json) : null
  } catch {
    return null
  }
}

export function saveSearchFormLayout(cacheKey, layout) {
  if (!cacheKey) return
  localStorage.setItem(getSearchFormLayoutCacheKey(cacheKey), JSON.stringify(layout))
}

export function removeSearchFormLayout(cacheKey) {
  if (!cacheKey) return
  localStorage.removeItem(getSearchFormLayoutCacheKey(cacheKey))
}
