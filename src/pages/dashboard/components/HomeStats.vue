<script setup>
defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <el-row :gutter="16" class="stats-row">
    <el-col v-for="item in stats" :key="item.label" :xs="12" :sm="12" :lg="6">
      <div class="stat-card" :class="`stat-card--${item.theme}`">
        <div class="stat-card__top">
          <div class="stat-card__icon">
            <el-icon :size="20">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <span class="stat-card__trend">{{ item.trend }}</span>
        </div>
        <p class="stat-card__value">
          {{ item.value }}
        </p>
        <p class="stat-card__label">
          {{ item.label }}
        </p>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 16px;
  padding: 18px 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  &__trend {
    font-size: 11px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    margin: 0 0 4px;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
  }

  &__label {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &--blue .stat-card__icon {
    color: #409eff;
    background: rgb(64 158 255 / 10%);
  }
  &--amber .stat-card__icon {
    color: #d4a853;
    background: rgb(212 168 83 / 12%);
  }
  &--green .stat-card__icon {
    color: #67c23a;
    background: rgb(103 194 58 / 10%);
  }
  &--rose .stat-card__icon {
    color: #f56c6c;
    background: rgb(245 108 108 / 10%);
  }
}
</style>
