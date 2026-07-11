<script setup>
import CategoryPieChart from "./CategoryPieChart.vue"

defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>分类分布</h2>
        <p>各栏目文章占比</p>
      </div>
    </div>
    <CategoryPieChart :data="data" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 16px;
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
