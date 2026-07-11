<script setup>
import { useDashboardData } from "../composables/useDashboardData"
import { useHomeGreeting } from "../composables/useHomeGreeting"
import { quickLinks, workflowSteps } from "../data"
import ActivityFeed from "./ActivityFeed.vue"
import CategoryPanel from "./CategoryPanel.vue"
import HomeHero from "./HomeHero.vue"
import HomeStats from "./HomeStats.vue"
import PublishTrendPanel from "./PublishTrendPanel.vue"
import QuickLinksPanel from "./QuickLinksPanel.vue"
import RecentArticlesPanel from "./RecentArticlesPanel.vue"

const { greeting, displayName, todaySummary } = useHomeGreeting()
const {
  loading,
  stats,
  recentArticles,
  weekTrend,
  categories,
  activities,
  useFallback
} = useDashboardData()
</script>

<template>
  <div v-loading="loading" class="home-page app-container">
    <el-alert
      v-if="useFallback"
      class="fallback-tip"
      type="info"
      :closable="false"
      show-icon
      title="工作台展示演示数据，接入 article/dashboard/overview 接口后将显示真实统计"
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
        <PublishTrendPanel :data="weekTrend" />
      </el-col>

      <el-col :xs="24" :lg="8">
        <ActivityFeed :activities="activities" />
        <CategoryPanel :data="categories" />
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
