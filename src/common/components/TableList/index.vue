<script setup>
import { PAGE_LAYOUT_KEY } from "@@/composables/usePageLayout"
import { usePagination } from "@@/composables/usePagination"
import { useTableHeight } from "@@/composables/useTableHeight"
import { sanitizeSearchParams } from "@@/utils/sanitize-search-params"
import { omit } from "lodash-es"

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  api: {
    type: Function,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  },
  immediate: {
    type: Boolean,
    default: true
  },
  autoHeight: {
    type: Boolean,
    default: true
  },
  height: {
    type: [String, Number],
    default: "100%"
  },
  hidePagination: {
    type: Boolean,
    default: false
  },
  heightOptions: {
    type: Object,
    default: () => ({})
  },
  /** 是否联动 PageLayout 筛选区折叠 */
  syncSearchCollapse: {
    type: Boolean,
    default: true
  },
  /** 默认每页条数 */
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(["selectionChange", "loadingChange"])

const loading = ref(false)
const tableData = ref([])

const tableListRef = useTemplateRef("tableListRef")
const tableWrapperRef = useTemplateRef("tableWrapperRef")
const tableRef = useTemplateRef("tableRef")
const pagerRef = useTemplateRef("pagerRef")

const scrollState = ref(null)
let lastScrollTop = 0

const pageLayoutContext = inject(PAGE_LAYOUT_KEY, null)

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({
  pageSize: props.pageSize
})

const { tableHeight, recalc } = useTableHeight({
  mode: "flex",
  tableEl: () => tableWrapperRef.value,
  containerEl: () => tableListRef.value,
  minHeight: 300,
  debounceDelay: 200,
  autoInit: props.autoHeight,
  ...props.heightOptions
})

const rootStyle = computed(() => {
  if (!props.autoHeight) return undefined

  const heightValue = Number(props.height)
  if (heightValue === 100 && props.height === "100%") {
    return undefined
  }

  return {
    height: Number.isNaN(heightValue) ? props.height : `${heightValue}px`
  }
})

const wrapperStyle = computed(() => {
  if (!props.autoHeight || props.hidePagination) {
    return { height: "100%" }
  }

  return { height: "calc(100% - 50px)" }
})

const tableHeightValue = computed(() => {
  if (!props.autoHeight) return undefined
  return tableHeight.value
})

function getColumnProps(column) {
  return omit(column, ["slot"])
}

function fetchData() {
  loading.value = true
  props.api({
    current: paginationData.current,
    pageSize: paginationData.pageSize,
    ...sanitizeSearchParams(props.params)
  }).then(({ data }) => {
    paginationData.total = Number(data.total)
    tableData.value = data.records
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}

function search() {
  if (paginationData.current === 1) {
    fetchData()
  } else {
    paginationData.current = 1
  }
}

function refresh() {
  fetchData()
}

function getTableBodyWrap() {
  const root = tableRef.value?.$el
  if (!root) return null
  return root.querySelector(".el-scrollbar__wrap")
    || root.querySelector(".el-table__body-wrapper")
}

function isTableScrollable() {
  const wrap = getTableBodyWrap()
  if (!wrap) return false
  return wrap.scrollHeight > wrap.clientHeight + 5
}

function reportTableScrollable() {
  if (!props.syncSearchCollapse || !pageLayoutContext?.notifyTableScrollable) return
  pageLayoutContext.notifyTableScrollable(isTableScrollable())
}

function handleScroll({ scrollTop, scrollLeft }) {
  scrollState.value = { top: scrollTop, left: scrollLeft }

  if (props.syncSearchCollapse && pageLayoutContext) {
    pageLayoutContext.handleTableScroll({
      scrollTop,
      scrollable: isTableScrollable(),
      delta: scrollTop - lastScrollTop
    })
  }

  lastScrollTop = scrollTop
}

function scheduleRecalcAfterCollapse() {
  if (!props.autoHeight) return

  recalc()
  const duration = pageLayoutContext?.searchCollapseDuration ?? 280
  window.setTimeout(() => {
    recalc()
    nextTick(() => reportTableScrollable())
  }, duration)
}

function restoreScrollAndLayout() {
  recalc()
  nextTick(() => {
    if (scrollState.value) {
      tableRef.value?.setScrollTop(scrollState.value.top)
      tableRef.value?.setScrollLeft(scrollState.value.left)
    }
    tableRef.value?.doLayout()
    reportTableScrollable()
  })
}

function clearSelection() {
  tableRef.value?.clearSelection()
}

watch(
  [() => paginationData.current, () => paginationData.pageSize],
  fetchData,
  { immediate: props.immediate }
)

watch(loading, (value) => {
  emit("loadingChange", value)
}, { immediate: true })

watch(
  () => loading.value,
  (value) => {
    if (!value && props.autoHeight) {
      restoreScrollAndLayout()
    }
  }
)

watch(tableHeight, () => {
  if (props.autoHeight) {
    nextTick(() => tableRef.value?.doLayout())
  }
})

if (pageLayoutContext?.searchCollapsed) {
  watch(pageLayoutContext.searchCollapsed, () => {
    scheduleRecalcAfterCollapse()
  })
}

if (pageLayoutContext?.layoutRefreshKey) {
  watch(pageLayoutContext.layoutRefreshKey, () => {
    restoreScrollAndLayout()
  })
}

onActivated(() => {
  lastScrollTop = scrollState.value?.top ?? 0
  nextTick(() => {
    requestAnimationFrame(() => {
      restoreScrollAndLayout()
    })
  })
})

onMounted(() => {
  if (props.autoHeight) {
    nextTick(() => {
      requestAnimationFrame(() => recalc())
    })
  }
})

defineExpose({ search, refresh, fetchData, recalc, clearSelection, tableRef, loading })
</script>

<template>
  <div
    ref="tableListRef"
    class="table-list"
    :class="{ 'table-list--contain': autoHeight }"
    :style="rootStyle"
  >
    <div class="table-list__wrapper" :style="wrapperStyle">
      <div ref="tableWrapperRef" class="table-list__table">
        <el-table
          ref="tableRef"
          stripe
          v-loading="loading"
          :data="tableData"
          :height="tableHeightValue"
          @scroll="handleScroll"
          @selection-change="rows => emit('selectionChange', rows)"
        >
          <template v-for="column in columns" :key="column.prop ?? column.label ?? column.type">
            <el-table-column v-bind="getColumnProps(column)">
              <template v-if="column.slot" #default="scope">
                <slot :name="column.slot" v-bind="scope" />
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>

    <div v-if="!hidePagination" ref="pagerRef" class="table-list__pager">
      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :current-page="paginationData.current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-list {
  &--contain {
    display: flex;
    flex-flow: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background-color: inherit;
  }

  &__wrapper {
    display: flex;
    flex-flow: column;
    min-height: 0;
  }

  &__table {
    display: flex;
    flex-flow: column;
    flex: 1;
    min-height: 0;
    height: 100px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__pager {
    flex-shrink: 0;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
  }
}
</style>
