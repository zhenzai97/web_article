<script setup>
import EChart from "@@/components/EChart/index.vue"

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
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
    axisLabel: { color: "#909399" }
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
      barWidth: 28,
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
