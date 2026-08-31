<script setup>
import { getDashboardTrendApi } from "@@/apis/dashboard"
import { weekTrend as fallbackTrend } from "../data"
import PublishTrendChart from "./PublishTrendChart.vue"

const RANGE_OPTIONS = [
  { label: "本周", value: "week", desc: "本周每日新建文章数量" },
  { label: "本月", value: "month", desc: "本月每日新建文章数量" },
  { label: "本季度", value: "quarter", desc: "本季度各月新建文章数量" },
  { label: "本年", value: "year", desc: "本年各月新建文章数量" }
]

const range = ref("week")
const loading = ref(false)
const trendData = ref([...fallbackTrend])

const currentOption = computed(
  () => RANGE_OPTIONS.find(item => item.value === range.value) || RANGE_OPTIONS[0]
)

async function loadTrend(nextRange = range.value) {
  loading.value = true
  try {
    const { data } = await getDashboardTrendApi(nextRange)
    trendData.value = Array.isArray(data) && data.length ? data : [...fallbackTrend]
  } catch {
    trendData.value = [...fallbackTrend]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTrend()
})
</script>

<template>
  <div v-loading="loading" class="panel panel--chart">
    <div class="panel-header">
      <div>
        <h2>文章新增趋势</h2>
        <p>{{ currentOption.desc }}</p>
      </div>
      <el-radio-group v-model="range" size="small" @change="loadTrend">
        <el-radio-button
          v-for="item in RANGE_OPTIONS"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <PublishTrendChart :data="trendData" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 0;
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);

  &--chart {
    margin-bottom: 0;
  }
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
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
