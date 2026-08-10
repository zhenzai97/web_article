import { getDashboardOverviewApi } from "@@/apis/dashboard"
import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import { Document, Location } from "@element-plus/icons-vue"
import {
  buildBizMetrics,
  buildWorkflowSteps,
  emptyBizStats,
  homeStats as fallbackHomeStats,
  recentAdvertising as fallbackRecentAdvertising,
  recentArticles as fallbackRecentArticles,
  recentTourism as fallbackRecentTourism,
  weekTrend as fallbackWeekTrend
} from "../data"

function buildStats(stats = {}, categories = []) {
  const tourismByType = (stats.tourismByType?.length
    ? stats.tourismByType
    : TOURISM_TYPE_OPTIONS.map(item => ({ type: item.value, label: item.label, count: 0 }))
  )

  return {
    article: {
      label: "文章",
      total: stats.articleTotal ?? 0,
      enabled: stats.articleEnabled ?? 0,
      disabled: stats.articleDisabled ?? 0,
      icon: Document,
      theme: "blue",
      byCategory: categories.map(item => ({
        id: item.id,
        name: item.name,
        count: item.count ?? 0,
        percent: item.percent ?? 0
      }))
    },
    tourism: {
      label: "文旅内容",
      total: stats.tourismTotal ?? 0,
      enabled: stats.tourismEnabled ?? 0,
      icon: Location,
      theme: "amber",
      byType: tourismByType
    }
  }
}

function mapRecentArticles(list = []) {
  return list.map(item => ({
    id: item.id,
    title: item.title,
    category: item.categoryName || "-",
    status: item.status,
    views: item.readNum ?? 0,
    updateTime: item.updateTime || "-"
  }))
}

function mapRecentTourism(list = []) {
  return list.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    status: item.status,
    updateTime: item.updateTime || "-"
  }))
}

function mapRecentAdvertising(list = []) {
  return list.map(item => ({
    id: item.id,
    name: item.name,
    spaceName: item.spaceName || "-",
    status: item.status,
    startTime: item.startTime || "-",
    endTime: item.endTime || "-",
    updateTime: item.updateTime || "-"
  }))
}

export function useDashboardData() {
  const loading = ref(false)
  const stats = ref(buildStats({}))
  const bizStats = ref({ ...emptyBizStats })
  const bizMetrics = ref(buildBizMetrics())
  const todos = ref([])
  const workflowSteps = ref(buildWorkflowSteps())
  const recentArticles = ref([...fallbackRecentArticles])
  const recentTourism = ref([...fallbackRecentTourism])
  const recentAdvertising = ref([...fallbackRecentAdvertising])
  const weekTrend = ref([...fallbackWeekTrend])
  const useFallback = ref(false)

  async function loadDashboard() {
    loading.value = true
    try {
      const { data } = await getDashboardOverviewApi()
      const nextBiz = { ...emptyBizStats, ...(data.bizStats || {}) }
      stats.value = buildStats(data.stats, data.categories || [])
      bizStats.value = nextBiz
      bizMetrics.value = buildBizMetrics(nextBiz)
      todos.value = data.todos || []
      workflowSteps.value = buildWorkflowSteps(nextBiz, data.stats?.articleTotal ?? 0)
      recentArticles.value = mapRecentArticles(data.recentArticles)
      recentTourism.value = mapRecentTourism(data.recentTourism)
      recentAdvertising.value = mapRecentAdvertising(data.recentAdvertising)
      weekTrend.value = data.weekTrend?.length ? data.weekTrend : fallbackWeekTrend
      useFallback.value = false
    } catch {
      useFallback.value = true
      stats.value = fallbackHomeStats
      bizStats.value = { ...emptyBizStats }
      bizMetrics.value = buildBizMetrics()
      todos.value = []
      workflowSteps.value = buildWorkflowSteps()
      recentArticles.value = []
      recentTourism.value = []
      recentAdvertising.value = []
      weekTrend.value = [...fallbackWeekTrend]
    } finally {
      loading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    loading,
    stats,
    bizStats,
    bizMetrics,
    todos,
    workflowSteps,
    recentArticles,
    recentTourism,
    recentAdvertising,
    weekTrend,
    useFallback,
    reload: loadDashboard
  }
}
