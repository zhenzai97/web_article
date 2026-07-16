import { getDashboardOverviewApi } from "@@/apis/dashboard"
import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import { Document, Location } from "@element-plus/icons-vue"
import {
  categories as fallbackCategories,
  homeStats as fallbackHomeStats,
  recentAdvertising as fallbackRecentAdvertising,
  recentArticles as fallbackRecentArticles,
  recentTourism as fallbackRecentTourism,
  weekTrend as fallbackWeekTrend
} from "../data"

function buildStats(stats = {}) {
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
      theme: "blue"
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
  const recentArticles = ref([...fallbackRecentArticles])
  const recentTourism = ref([...fallbackRecentTourism])
  const recentAdvertising = ref([...fallbackRecentAdvertising])
  const weekTrend = ref([...fallbackWeekTrend])
  const categories = ref([...fallbackCategories])
  const useFallback = ref(false)

  async function loadDashboard() {
    loading.value = true
    try {
      const { data } = await getDashboardOverviewApi()
      stats.value = buildStats(data.stats)
      recentArticles.value = mapRecentArticles(data.recentArticles)
      recentTourism.value = mapRecentTourism(data.recentTourism)
      recentAdvertising.value = mapRecentAdvertising(data.recentAdvertising)
      weekTrend.value = data.weekTrend?.length ? data.weekTrend : fallbackWeekTrend
      categories.value = data.categories?.length ? data.categories : []
      useFallback.value = false
    } catch {
      useFallback.value = true
      stats.value = fallbackHomeStats
      recentArticles.value = []
      recentTourism.value = []
      recentAdvertising.value = []
      weekTrend.value = [...fallbackWeekTrend]
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    loading,
    stats,
    recentArticles,
    recentTourism,
    recentAdvertising,
    weekTrend,
    categories,
    useFallback,
    reload: loadDashboard
  }
}
