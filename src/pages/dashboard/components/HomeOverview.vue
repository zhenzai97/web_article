<script setup>
import { useDashboardData } from "../composables/useDashboardData"
import { useHomeGreeting } from "../composables/useHomeGreeting"
import { quickLinks } from "../data"
import BizMetrics from "./BizMetrics.vue"
import HomeHero from "./HomeHero.vue"
import HomeStats from "./HomeStats.vue"
import PublishTrendPanel from "./PublishTrendPanel.vue"
import QuickLinksPanel from "./QuickLinksPanel.vue"
import RecentAdvertisingPanel from "./RecentAdvertisingPanel.vue"
import RecentArticlesPanel from "./RecentArticlesPanel.vue"
import TodoPanel from "./TodoPanel.vue"

const {
  loading,
  stats,
  bizStats,
  bizMetrics,
  todos,
  workflowSteps,
  recentArticles,
  recentAdvertising,
  weekTrend,
  useFallback,
  reload
} = useDashboardData()

const { greeting, displayName, todaySummary } = useHomeGreeting(stats, weekTrend, bizStats, todos)
</script>

<template>
  <div v-loading="loading" class="home-page app-container">
    <el-alert
      v-if="useFallback"
      class="fallback-tip"
      type="warning"
      :closable="false"
      show-icon
      title="工作台数据加载失败，请确认已登录且后端 /dashboard/overview 可用"
    >
      <template #default>
        <el-button type="warning" link @click="reload">
          点击重试
        </el-button>
      </template>
    </el-alert>

    <HomeHero
      :greeting="greeting"
      :display-name="displayName"
      :summary="todaySummary"
      :steps="workflowSteps"
    />

    <BizMetrics :metrics="bizMetrics" />

    <HomeStats :stats="stats" />

    <el-row :gutter="16" class="main-row">
      <el-col :xs="24" :lg="16">
        <TodoPanel :todos="todos" />
        <RecentArticlesPanel :articles="recentArticles" />
        <PublishTrendPanel :data="weekTrend" />
      </el-col>

      <el-col :xs="24" :lg="8">
        <QuickLinksPanel :links="quickLinks" />
        <RecentAdvertisingPanel :list="recentAdvertising" />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}

.fallback-tip {
  margin-bottom: 16px;
}

.main-row {
  align-items: flex-start;
}
</style>
