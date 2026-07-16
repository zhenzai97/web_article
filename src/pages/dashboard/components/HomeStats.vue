<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <el-row :gutter="16" class="stats-row">
    <el-col :xs="24" :md="10" :lg="8">
      <div class="stat-card" :class="`stat-card--${stats.article.theme}`">
        <div class="stat-card__top">
          <div class="stat-card__icon">
            <el-icon :size="20">
              <component :is="stats.article.icon" />
            </el-icon>
          </div>
          <span class="stat-card__label">{{ stats.article.label }}</span>
        </div>
        <p class="stat-card__value">
          {{ stats.article.total }}
        </p>
        <div class="stat-card__meta">
          <span>启用 {{ stats.article.enabled }}</span>
          <span class="dot">·</span>
          <span>禁用 {{ stats.article.disabled }}</span>
        </div>
      </div>
    </el-col>

    <el-col :xs="24" :md="14" :lg="16">
      <div class="stat-card stat-card--tourism" :class="`stat-card--${stats.tourism.theme}`">
        <div class="stat-card__top">
          <div class="stat-card__icon">
            <el-icon :size="20">
              <component :is="stats.tourism.icon" />
            </el-icon>
          </div>
          <div class="stat-card__title-wrap">
            <span class="stat-card__label">{{ stats.tourism.label }}</span>
            <span class="stat-card__meta">
              合计 {{ stats.tourism.total }} · 启用 {{ stats.tourism.enabled }}
            </span>
          </div>
        </div>
        <div class="type-grid">
          <div
            v-for="item in stats.tourism.byType"
            :key="item.type"
            class="type-item"
          >
            <p class="type-item__count">
              {{ item.count }}
            </p>
            <p class="type-item__label">
              {{ item.label }}
            </p>
          </div>
        </div>
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
  min-height: 132px;

  &__top {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  &__title-wrap {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: baseline;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__value {
    margin: 0 0 8px;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
  }

  &__meta {
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
}

.dot {
  margin: 0 6px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.type-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
  text-align: center;

  &__count {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.1;
  }

  &__label {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

@media (width >= 992px) {
  .type-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
