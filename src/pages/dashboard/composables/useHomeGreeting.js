import { useUserStore } from "@/pinia/stores/user"
import { homeStats, weekTrend } from "../data"

export function useHomeGreeting() {
  const userStore = useUserStore()

  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "早上好"
    if (hour < 18) return "下午好"
    return "晚上好"
  })

  const displayName = computed(() => userStore.username || "管理员")

  const todaySummary = computed(() => ({
    publish: weekTrend.reduce((sum, item) => sum + item.value, 0),
    pending: homeStats[3].value,
    draft: homeStats[1].value
  }))

  return { greeting, displayName, todaySummary }
}
