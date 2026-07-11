<script setup>
import EChart from "@@/components/EChart/index.vue"

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartOption = computed(() => ({ tooltip: {
  trigger: "item",
  formatter: "{b })"
}, legend: {
  bottom: 0,
  left: "center",
  itemWidth: 10,
  itemHeight: 10,
  textStyle: { color: "#909399", fontSize: 12 }
}, color: ["#409eff", "#d4a853", "#67c23a", "#909399"], series: [
  {
    name: "分类分布",
    type: "pie",
    radius: ["42%", "68%"],
    center: ["50%", "44%"],
    avoidLabelOverlap: true,
    itemStyle: {
      borderRadius: 6,
      borderColor: "#fff",
      borderWidth: 2
    },
    label: {
      show: false
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 13,
        fontWeight: "bold"
      }
    },
    data: props.data.map(item => ({
      name,
      value: item.count
    }))
  }
] }))
</script>

<template>
  <EChart :option="chartOption" height="280px" />
</template>
