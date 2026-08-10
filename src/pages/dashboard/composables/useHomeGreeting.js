import { useUserStore } from "@/pinia/stores/user"
import { emptyBizStats, homeStats as fallbackStats, weekTrend as fallbackWeekTrend } from "../data"

/**
 * @param {import("vue").Ref|object} [statsSource]
 * @param {import("vue").Ref|Array} [weekTrendSource]
 * @param {import("vue").Ref|object} [bizStatsSource]
 * @param {import("vue").Ref|Array} [todosSource]
 */
export function useHomeGreeting(statsSource, weekTrendSource, bizStatsSource, todosSource) {
  const userStore = useUserStore()

  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "早上好"
    if (hour < 18) return "下午好"
    return "晚上好"
  })

  const displayName = computed(() => userStore.username || "管理员")

  const todaySummary = computed(() => {
    const stats = unref(statsSource) || fallbackStats
    const trend = unref(weekTrendSource) || fallbackWeekTrend
    const biz = unref(bizStatsSource) || emptyBizStats
    const todoList = unref(todosSource) || []
    const weekNew = Array.isArray(trend)
      ? trend.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
      : 0
    const pendingCount = todoList
      .filter(item => item.key !== "allClear")
      .reduce((sum, item) => sum + (Number(item.count) || 0), 0)

    return {
      articleTotal: stats.article?.total ?? 0,
      articleEnabled: stats.article?.enabled ?? 0,
      articleDisabled: stats.article?.disabled ?? 0,
      tourismTotal: stats.tourism?.total ?? 0,
      weekNew,
      pendingCount,
      jadeApplyPending: biz.jadeApplyPending ?? 0,
      advertisingExpiring: biz.advertisingExpiring ?? 0
    }
  })

  return { greeting, displayName, todaySummary }
}
