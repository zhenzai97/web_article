/**
 * 清理查询参数：移除空值，并处理不完整的日期范围
 * @param {Record<string, unknown>} params
 */
export function sanitizeSearchParams(params = {}) {
  const result = { ...params }

  Object.keys(result).forEach((key) => {
    if (key.endsWith("StartTime")) {
      const endKey = key.replace("StartTime", "EndTime")
      const hasStart = !!result[key]
      const hasEnd = !!result[endKey]
      if (!hasStart || !hasEnd) {
        delete result[key]
        delete result[endKey]
      }
    }
  })

  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (value === "" || value === undefined || value === null) {
      delete result[key]
    }
  })

  return result
}

/**
 * 重置日期范围筛选项（el-form 仅注册开始时间 prop）
 * @param {Record<string, unknown>} model
 * @param {Array<{ component?: string, values?: string[] }>} items
 */
export function resetDateRangeFields(model, items = []) {
  items.forEach((item) => {
    if (item.component !== "date" || !item.values?.length) return
    item.values.forEach((key) => {
      model[key] = undefined
    })
  })
}
