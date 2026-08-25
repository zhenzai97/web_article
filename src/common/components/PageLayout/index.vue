<script setup>
import { PAGE_LAYOUT_KEY } from "@@/composables/usePageLayout"

defineOptions({
  name: "PageLayout"
})

defineProps({
  /**
   * 兼容旧用法；已改为仅手动展开/收起，此 prop 不再驱动自动折叠
   * @deprecated
   */
  collapseSearchOnTableScroll: {
    type: Boolean,
    default: false
  }
})

const searchCollapsed = ref(false)

const SEARCH_COLLAPSE_DURATION = 280

function expandSearch() {
  if (!searchCollapsed.value) return
  searchCollapsed.value = false
  refreshLayout()
}

function collapseSearch() {
  if (searchCollapsed.value) return
  searchCollapsed.value = true
  refreshLayout()
}

function toggleSearch() {
  if (searchCollapsed.value) {
    expandSearch()
  } else {
    collapseSearch()
  }
}

/** 保留空实现，兼容 TableList 滚动回调 */
function handleTableScroll() {}

function notifyTableScrollable() {}

function resetTableScrollState() {
  searchCollapsed.value = false
}

const layoutRefreshKey = ref(0)

function refreshLayout() {
  layoutRefreshKey.value++
}

provide(PAGE_LAYOUT_KEY, {
  handleTableScroll,
  notifyTableScrollable,
  expandSearch,
  collapseSearch,
  toggleSearch,
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
