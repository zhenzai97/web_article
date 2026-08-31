<script setup>
import OptionLabel from "@@/components/OptionLabel/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { ArrowRight } from "@element-plus/icons-vue"

defineProps({
  articles: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>最近文章</h2>
        <p>按更新时间倒序</p>
      </div>
      <router-link to="/content/article" class="more-link">
        查看全部
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </router-link>
    </div>
    <el-table :data="articles" stripe empty-text="暂无文章">
      <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="110" />
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读" width="70" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160" />
    </el-table>
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
