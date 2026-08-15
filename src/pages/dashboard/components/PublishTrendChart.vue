<script setup>
import EChart from "@@/components/EChart/index.vue"

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const barWidth = computed(() => {
  const count = props.data?.length || 0
  if (count <= 3) return 36
  if (count <= 7) return 28
  if (count <= 14) return 18
  if (count <= 31) return 12
  return 8
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" }
  },
  grid: {
    left: 48,
    right: 24,
    top: 24,
    bottom: 32
  },
  xAxis: {
    type: "category",
    data: props.data.map(item => item.label),
    axisLine: { lineStyle: { color: "#dcdfe6" } },
    axisLabel: {
      color: "#909399",
      interval: props.data.length > 16 ? "auto" : 0,
      rotate: props.data.length > 16 ? 40 : 0
    }
  },
  yAxis: {
    type: "value",
    minInterval: 1,
    splitLine: { lineStyle: { type: "dashed", color: "#ebeef5" } },
    axisLabel: { color: "#909399" }
  },
  series: [
    {
      name: "发布数量",
      type: "bar",
      barWidth: barWidth.value,
      data: props.data.map(item => item.value),
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#79bbff" },
            { offset: 1, color: "#409eff" }
          ]
        }
      }
    }
  ]
}))
</script>

<template>
  <EChart :option="chartOption" height="260px" />
</template>
