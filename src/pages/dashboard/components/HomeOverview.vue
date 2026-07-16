<script setup>
import { useDashboardData } from "../composables/useDashboardData"
import { useHomeGreeting } from "../composables/useHomeGreeting"
import { quickLinks, workflowSteps } from "../data"
import HomeHero from "./HomeHero.vue"
import HomeStats from "./HomeStats.vue"
import PublishTrendPanel from "./PublishTrendPanel.vue"
import QuickLinksPanel from "./QuickLinksPanel.vue"
import RecentAdvertisingPanel from "./RecentAdvertisingPanel.vue"
import RecentArticlesPanel from "./RecentArticlesPanel.vue"
import RecentTourismPanel from "./RecentTourismPanel.vue"

const {
  loading,
  stats,
  recentArticles,
  recentTourism,
  recentAdvertising,
  weekTrend,
  useFallback
} = useDashboardData()

const { greeting, displayName, todaySummary } = useHomeGreeting(stats, weekTrend)
</script>

<template>
  <div v-loading="loading" class="home-page app-container">
    <el-alert
      v-if="useFallback"
      class="fallback-tip"
      type="warning"
      :closable="false"
      show-icon
      title="工作台数据加载失败，请确认已登录且后端已提供 /dashboard/overview"
    />

    <HomeHero
      :greeting="greeting"
      :display-name="displayName"
      :summary="todaySummary"
      :steps="workflowSteps"
    />

    <HomeStats :stats="stats" />

    <el-row :gutter="16" class="main-row">
      <el-col :xs="24" :lg="16">
        <RecentArticlesPanel :articles="recentArticles" />
        <RecentTourismPanel :list="recentTourism" />
        <RecentAdvertisingPanel :list="recentAdvertising" />
        <PublishTrendPanel :data="weekTrend" />
      </el-col>

      <el-col :xs="24" :lg="8">
        <QuickLinksPanel :links="quickLinks" />
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
