<script setup>
import * as echarts from "echarts"

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: "280px"
  }
})

const chartRef = useTemplateRef("chartRef")

let chartInstance = null
let resizeObserver = null

function renderChart() {
  if (!chartRef.value) {
    return
  }
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  chartInstance.setOption(props.option, true)
}

function disposeChart() {
  resizeObserver?.disconnect()
  resizeObserver = null
  chartInstance?.dispose()
  chartInstance = null
}

watch(
  () => props.option,
  () => {
    renderChart()
  },
  { deep: true }
)

onMounted(() => {
  renderChart()
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
})

onBeforeUnmount(disposeChart)
</script>

<template>
  <div ref="chartRef" class="echart-container" :style="{ height }" />
</template>

<style lang="scss" scoped>
.echart-container {
  width: 100%;
}
</style>
