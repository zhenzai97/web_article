<script setup>
import OptionLabel from "@@/components/OptionLabel/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import { ArrowRight } from "@element-plus/icons-vue"

defineProps({
  list: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>最近文旅</h2>
        <p>农产品 / 品牌 / 景点等</p>
      </div>
      <router-link to="/content/tourism" class="more-link">
        查看全部
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </router-link>
    </div>
    <el-table :data="list" stripe empty-text="暂无文旅内容">
      <el-table-column prop="name" label="名称" min-width="140" show-overflow-tooltip />
      <el-table-column label="类型" width="100" align="center">
        <template #default="{ row }">
          <OptionLabel :options="TOURISM_TYPE_OPTIONS" :value="row.type" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" />
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
