<script setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { getArticleStatus } from "../utils/article-status"

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
        <p>最新创建或更新的内容</p>
      </div>
      <el-button link type="primary" disabled>
        查看全部
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>
    <el-table :data="articles" stripe>
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="author" label="作者" width="80" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getArticleStatus(row.status).type" size="small" effect="plain">
            {{ getArticleStatus(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读" width="70" align="center" />
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
</style>
