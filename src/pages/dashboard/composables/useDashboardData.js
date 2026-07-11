import { getArticleDashboardApi } from "@@/apis/articles"
import { Document, EditPen, Timer, View } from "@element-plus/icons-vue"
import {
  activities as fallbackActivities,
  categories as fallbackCategories,
  homeStats as fallbackHomeStats,
  recentArticles as fallbackRecentArticles,
  weekTrend as fallbackWeekTrend
} from "../data"
import { mapApiStatusToUi } from "../utils/article-status"

function buildStats(stats) {
  const publishedPercent = stats.total
    ? Math.round((stats.published / stats.total) * 100)
    : 0
  return [
    {
      label: "文章总数",
      value: String(stats.total),
      trend: `草稿 ${stats.draft} 篇`,
      icon: Document,
      theme: "blue"
    },
    {
      label: "草稿箱",
      value: String(stats.draft),
      trend: "待完善内容",
      icon: EditPen,
      theme: "amber"
    },
    {
      label: "已发布",
      value: String(stats.published),
      trend: `占比 ${publishedPercent}%`,
      icon: View,
      theme: "green"
    },
    {
      label: "待审核",
      value: String(stats.review),
      trend: stats.review ? "需尽快处理" : "暂无待审",
      icon: Timer,
      theme: "rose"
    }
  ]
}

function mapRecentArticles(list) {
  return list.map(item => ({
    id: item.id,
    title: item.title,
    category: item.cateName || item.cateSign || "-",
    author: item.author || "-",
    status: mapApiStatusToUi(item.status),
    views: item.readCount ?? 0,
    updateTime: item.updateTime || item.publishTime || item.createTime || "-"
  }))
}

export function useDashboardData() {
  const loading = ref(false)
  const stats = ref([...fallbackHomeStats])
  const recentArticles = ref([...fallbackRecentArticles])
  const weekTrend = ref([...fallbackWeekTrend])
  const categories = ref([...fallbackCategories])
  const activities = ref([...fallbackActivities])
  const useFallback = ref(true)

  async function loadDashboard() {
    loading.value = true
    try {
      const { data } = await getArticleDashboardApi()
      stats.value = buildStats(data.stats)
      recentArticles.value = mapRecentArticles(data.recentArticles)
      weekTrend.value = data.publishTrend?.length ? data.publishTrend : fallbackWeekTrend
      categories.value = data.categoryStats?.length ? data.categoryStats : fallbackCategories
      useFallback.value = false
    } catch {
      useFallback.value = true
    } finally {
      loading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    loading,
    stats,
    recentArticles,
    weekTrend,
    categories,
    activities,
    useFallback,
    reload: loadDashboard
  }
}
