<script setup>
import PublishTrendChart from "./PublishTrendChart.vue"

defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel panel--chart">
    <div class="panel-header">
      <div>
        <h2>近 7 日发布趋势</h2>
        <p>每日发布文章数量</p>
      </div>
    </div>
    <PublishTrendChart :data="data" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 16px;
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);

  &--chart {
    margin-bottom: 0;
  }
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
