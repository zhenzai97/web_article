<script setup>
import { PAGE_LAYOUT_KEY } from "@@/composables/usePageLayout"

defineOptions({
  name: "PageLayout"
})

const { collapseSearchOnTableScroll = true } = defineProps({
  /** 表格向下滚动时收起顶部筛选区 */
  collapseSearchOnTableScroll: {
    type: Boolean,
    default: true
  }
})

const searchCollapsed = ref(false)

const SCROLL_THRESHOLD = 5
const SEARCH_COLLAPSE_DURATION = 280

let lastTableScrollTop = 0
/** 折叠/展开动画期间忽略表格滚动，避免高度变化导致回弹 */
let scrollLock = false
let scrollLockTimer = 0

function lockScrollDuringCollapse() {
  scrollLock = true
  window.clearTimeout(scrollLockTimer)
  scrollLockTimer = window.setTimeout(() => {
    scrollLock = false
  }, SEARCH_COLLAPSE_DURATION + 80)
}

function expandSearch() {
  if (!searchCollapsed.value) return
  searchCollapsed.value = false
  lastTableScrollTop = 0
  lockScrollDuringCollapse()
  refreshLayout()
}

/**
 * @param {{ scrollTop: number, scrollable?: boolean }} payload
 * scrollable=false 时禁止收起，并在已收起时自动展开（表格不够高无法上滚找回筛选）
 */
function handleTableScroll({ scrollTop, scrollable }) {
  if (!collapseSearchOnTableScroll || scrollLock) return

  if (scrollable === false) {
    if (searchCollapsed.value) {
      expandSearch()
    }
    lastTableScrollTop = scrollTop
    return
  }

  const delta = scrollTop - lastTableScrollTop
  let nextCollapsed = searchCollapsed.value

  // 仅在主动上滚到顶部时展开，避免高度变化后的伪滚动再次触发折叠
  if (scrollTop <= SCROLL_THRESHOLD && delta <= 0) {
    nextCollapsed = false
  } else if (delta > SCROLL_THRESHOLD && scrollTop > SCROLL_THRESHOLD) {
    nextCollapsed = true
  }

  if (nextCollapsed !== searchCollapsed.value) {
    searchCollapsed.value = nextCollapsed
    lockScrollDuringCollapse()
  }

  lastTableScrollTop = scrollTop
}

/** 表格高度重算后回调：内容不足以滚动时强制展开筛选 */
function notifyTableScrollable(scrollable) {
  if (!collapseSearchOnTableScroll) return
  if (!scrollable && searchCollapsed.value) {
    expandSearch()
  }
}

function resetTableScrollState() {
  lastTableScrollTop = 0
  searchCollapsed.value = false
  scrollLock = false
  window.clearTimeout(scrollLockTimer)
}

const layoutRefreshKey = ref(0)

function refreshLayout() {
  layoutRefreshKey.value++
}

provide(PAGE_LAYOUT_KEY, {
  handleTableScroll,
  notifyTableScrollable,
  expandSearch,
  searchCollapsed: readonly(searchCollapsed),
  searchCollapseDuration: SEARCH_COLLAPSE_DURATION,
  layoutRefreshKey: readonly(layoutRefreshKey)
})

onActivated(() => {
  resetTableScrollState()
  nextTick(() => {
    requestAnimationFrame(refreshLayout)
  })
})

onBeforeUnmount(() => {
  window.clearTimeout(scrollLockTimer)
})
</script>

<template>
  <div class="page-layout app-container">
    <div v-if="$slots.stats" class="page-layout__stats">
      <slot name="stats" />
    </div>

    <div
      v-if="$slots.search"
      class="page-layout__search-wrapper"
      :class="{ 'is-collapsed': searchCollapsed }"
    >
      <div class="page-layout__search-inner">
        <el-card shadow="never" class="page-layout__search">
          <slot name="search" />
        </el-card>
      </div>
    </div>

    <el-card shadow="never" class="page-layout__main">
      <div
        v-if="$slots.search && searchCollapsed"
        class="page-layout__search-expand"
      >
        <el-button type="primary" text bg size="small" @click="expandSearch">
          展开筛选
        </el-button>
      </div>

      <div v-if="$slots.toolbar" class="page-layout__toolbar">
        <slot name="toolbar" />
      </div>

      <div class="page-layout__table">
        <slot name="table" />
      </div>
    </el-card>

    <slot name="footer" />
  </div>
</template>

<style lang="scss" scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.page-layout__stats {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.page-layout__search-wrapper {
  flex-shrink: 0;
  display: grid;
  grid-template-rows: 1fr;
  margin-bottom: 20px;
  transition:
    grid-template-rows 0.28s ease,
    margin-bottom 0.28s ease;

  &.is-collapsed {
    grid-template-rows: 0fr;
    margin-bottom: 0;
  }
}

.page-layout__search-inner {
  min-height: 0;
  overflow: hidden;
}

.page-layout__search {
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.page-layout__main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.page-layout__search-expand {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.page-layout__toolbar {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-layout__table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
