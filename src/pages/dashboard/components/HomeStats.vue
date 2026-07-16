<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function goArticleCategory(item) {
  if (!item?.id) {
    ElMessage.info("未分类暂不支持跳转筛选")
    return
  }
  router.push({
    path: "/content/article",
    query: { categoryId: String(item.id) }
  })
}

function goTourismType(item) {
  if (!item?.type) {
    return
  }
  router.push({
    path: "/content/tourism",
    query: { type: item.type }
  })
}
</script>

<template>
  <el-row :gutter="16" class="stats-row">
    <el-col :span="24">
      <div class="stat-card" :class="`stat-card--${stats.article.theme}`">
        <div class="stat-card__header">
          <div class="stat-card__top">
            <div class="stat-card__icon">
              <el-icon :size="20">
                <component :is="stats.article.icon" />
              </el-icon>
            </div>
            <div class="stat-card__title-wrap">
              <span class="stat-card__label">{{ stats.article.label }}</span>
              <span class="stat-card__meta">
                合计 {{ stats.article.total }} · 启用 {{ stats.article.enabled }} · 禁用 {{ stats.article.disabled }}
              </span>
            </div>
          </div>
          <p class="stat-card__value">
            {{ stats.article.total }}
          </p>
        </div>
        <div v-if="stats.article.byCategory?.length" class="type-grid">
          <button
            v-for="item in stats.article.byCategory"
            :key="item.id || item.name"
            type="button"
            class="type-item"
            :class="{ 'type-item--disabled': !item.id }"
            @click="goArticleCategory(item)"
          >
            <p class="type-item__count">
              {{ item.count }}
            </p>
            <p class="type-item__label" :title="item.name">
              {{ item.name }}
            </p>
            <p class="type-item__percent">
              {{ item.percent }}%
            </p>
          </button>
        </div>
        <div v-else class="empty-tip">
          暂无分类数据
        </div>
      </div>
    </el-col>

    <el-col :span="24">
      <div class="stat-card" :class="`stat-card--${stats.tourism.theme}`">
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
          <button
            v-for="item in stats.tourism.byType"
            :key="item.type"
            type="button"
            class="type-item"
            @click="goTourismType(item)"
          >
            <p class="type-item__count">
              {{ item.count }}
            </p>
            <p class="type-item__label">
              {{ item.label }}
            </p>
          </button>
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

  &__header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  &__top {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  &__header &__top {
    margin-bottom: 0;
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
    margin: 0;
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.type-item {
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.75;

    &:hover {
      border-color: transparent;
      background: var(--el-fill-color-lighter);
    }
  }

  &__count {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--el-text-color-primary);
  }

  &__label {
    margin: 0;
    overflow: hidden;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__percent {
    margin: 4px 0 0;
    font-size: 11px;
    color: var(--el-text-color-placeholder);
  }
}

.empty-tip {
  padding: 16px 0 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

@media (width >= 768px) {
  .type-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (width >= 1200px) {
  .type-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
