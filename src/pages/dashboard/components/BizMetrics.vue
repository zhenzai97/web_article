<script setup>
defineProps({
  metrics: {
    type: Array,
    required: true
  }
})

const router = useRouter()

function go(path) {
  if (path) router.push(path)
}
</script>

<template>
  <el-row :gutter="10" class="biz-metrics">
    <el-col
      v-for="item in metrics"
      :key="item.key"
      :xs="12"
      :sm="8"
      :md="6"
      :lg="3"
    >
      <button
        type="button"
        class="metric-card"
        :class="`metric-card--${item.theme}`"
        @click="go(item.path)"
      >
        <span class="metric-card__label">{{ item.label }}</span>
        <span class="metric-card__value">{{ item.value }}</span>
      </button>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.biz-metrics {
  margin-bottom: -10px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 10px;
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    transform: translateY(-1px);
  }

  &__label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    color: var(--el-text-color-primary);
  }

  &--blue &__value { color: #409eff; }
  &--amber &__value { color: #d4a853; }
  &--violet &__value { color: #8b5cf6; }
  &--green &__value { color: #67c23a; }
}
</style>
