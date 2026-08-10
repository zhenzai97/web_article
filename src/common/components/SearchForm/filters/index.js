import DateRangeFilter from "./DateRangeFilter.vue"
import InputFilter from "./InputFilter.vue"
import RemoteSelectFilter from "./RemoteSelectFilter.vue"
import SelectFilter from "./SelectFilter.vue"

/** 筛选组件注册表，扩展新类型时在此注册即可 */
const filterRegistry = {
  input: {
    component: InputFilter,
    defaultSpan: 8,
    getFormProp: item => item.value
  },
  select: {
    component: SelectFilter,
    defaultSpan: 8,
    getFormProp: item => item.value
  },
  /** 远程分页下拉：滚动加载 + 关键字筛选 */
  remoteSelect: {
    component: RemoteSelectFilter,
    defaultSpan: 8,
    getFormProp: item => item.value
  },
  date: {
    component: DateRangeFilter,
    defaultSpan: 12,
    getFormProp: item => (item.values ?? ["startTime", "endTime"])[0]
  }
}

/** 解析筛选组件配置 */
export function resolveFilter(type) {
  return filterRegistry[type] ?? filterRegistry.input
}

/** 注册自定义筛选组件 */
export function registerFilter(type, config) {
  filterRegistry[type] = config
}

/** 获取表单项 prop（供 el-form 校验 / 重置） */
export function getFilterFormProp(item) {
  return resolveFilter(item.component).getFormProp(item)
}

/** 获取筛选项默认栅格宽度 */
export function getFilterDefaultSpan(type) {
  return resolveFilter(type).defaultSpan
}

export { filterRegistry }
