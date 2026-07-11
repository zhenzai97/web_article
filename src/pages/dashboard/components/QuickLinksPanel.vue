<script setup>
defineProps({
  links: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel panel--compact">
    <div class="panel-header">
      <div>
        <h2>快捷入口</h2>
      </div>
    </div>
    <div class="quick-grid">
      <router-link v-for="link in links" :key="link.path" :to="link.path" class="quick-chip">
        <el-icon :size="16">
          <component :is="link.icon" />
        </el-icon>
        <span>{{ link.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 16px;
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);

  &--compact {
    padding-bottom: 16px;
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
}

.quick-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-chip {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
  }
}
</style>
