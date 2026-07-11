<script setup>
defineOptions({
  name: "PageLayout"
})
</script>

<template>
  <div class="page-layout app-container">
    <div v-if="$slots.stats" class="page-layout__stats">
      <slot name="stats" />
    </div>

    <el-card v-if="$slots.search" shadow="never" class="page-layout__search">
      <slot name="search" />
    </el-card>

    <el-card shadow="never" class="page-layout__main">
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
.page-layout__stats {
  margin-bottom: 20px;
}

.page-layout__search {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.page-layout__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-layout__table {
  :deep(.table-wrapper) {
    margin-bottom: 20px;
  }

  :deep(.pager-wrapper) {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
