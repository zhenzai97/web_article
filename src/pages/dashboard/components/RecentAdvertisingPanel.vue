<script setup>
import OptionLabel from "@@/components/OptionLabel/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { ArrowRight } from "@element-plus/icons-vue"

defineProps({
  list: {
    type: Array,
    required: true
  }
})

function formatDate(value) {
  if (!value || value === "-") return "-"
  return String(value).slice(0, 10)
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>最近广告</h2>
        <p>运营素材与排期</p>
      </div>
      <router-link to="/operation/advertising" class="more-link">
        查看全部
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </router-link>
    </div>
    <el-table :data="list" stripe empty-text="暂无广告">
      <el-table-column prop="name" label="标题" min-width="140" show-overflow-tooltip />
      <el-table-column prop="spaceName" label="运营位" width="110" show-overflow-tooltip />
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="排期" min-width="150">
        <template #default="{ row }">
          {{ formatDate(row.startTime) }} ~ {{ formatDate(row.endTime) }}
        </template>
      </el-table-column>
    </el-table>
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

.more-link {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: var(--el-color-primary);
  text-decoration: none;
}
</style>
