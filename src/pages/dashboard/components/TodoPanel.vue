<script setup>
import { ArrowRight, WarningFilled } from "@element-plus/icons-vue"

defineProps({
  todos: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>待办事项</h2>
        <p>优先处理审核与到期提醒</p>
      </div>
    </div>

    <div v-if="todos.length" class="todo-list">
      <router-link
        v-for="item in todos"
        :key="item.key"
        :to="item.path || '/dashboard'"
        class="todo-item"
        :class="`todo-item--${item.level || 'info'}`"
      >
        <div class="todo-item__main">
          <div class="todo-item__title-row">
            <el-icon v-if="item.level === 'danger' || item.level === 'warning'" class="todo-item__icon">
              <WarningFilled />
            </el-icon>
            <span class="todo-item__title">{{ item.title }}</span>
          </div>
          <p class="todo-item__desc">
            {{ item.desc }}
          </p>
        </div>
        <div class="todo-item__aside">
          <span v-if="item.count > 0" class="todo-item__count">{{ item.count }}</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </router-link>
    </div>
    <div v-else class="empty-tip">
      暂无待办
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 0;
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);
}

.panel-header {
  margin-bottom: 16px;

  h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
  }

  &--danger {
    border-color: rgb(245 108 108 / 35%);
    background: rgb(245 108 108 / 6%);
  }

  &--warning {
    border-color: rgb(230 162 60 / 35%);
    background: rgb(230 162 60 / 6%);
  }

  &__main {
    min-width: 0;
    flex: 1;
  }

  &__title-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  &__icon {
    color: var(--el-color-warning);
  }

  &--danger &__icon {
    color: var(--el-color-danger);
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__aside {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--el-text-color-secondary);
  }

  &__count {
    min-width: 28px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    text-align: center;
  }

  &--danger &__count {
    color: var(--el-color-danger);
    background: rgb(245 108 108 / 12%);
  }

  &--warning &__count {
    color: var(--el-color-warning);
    background: rgb(230 162 60 / 12%);
  }
}

.empty-tip {
  padding: 20px 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
