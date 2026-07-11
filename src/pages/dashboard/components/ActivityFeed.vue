<script setup>
defineProps({
  activities: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>最新动态</h2>
        <p>内容与管理操作记录</p>
      </div>
    </div>
    <ul class="activity-list">
      <li v-for="item in activities" :key="item.id" class="activity-item">
        <span class="activity-time">{{ item.time }}</span>
        <div class="activity-body">
          <p>
            <strong>{{ item.user }}</strong>
            {{ item.action }}
            <em>{{ item.target }}</em>
          </p>
        </div>
      </li>
    </ul>
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

.activity-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-extra-light);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
}

.activity-time {
  flex-shrink: 0;
  width: 40px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.activity-body {
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-regular);

    strong {
      color: var(--el-text-color-primary);
    }

    em {
      font-style: normal;
      color: var(--el-color-primary);
    }
  }
}
</style>
