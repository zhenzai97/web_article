<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const model = inject("searchFormModel")

function getRangeKeys() {
  return props.item.values ?? ["startTime", "endTime"]
}

const rangeValue = computed({
  get() {
    const [startKey, endKey] = getRangeKeys()
    const start = model.value[startKey]
    const end = model.value[endKey]
    if (!start && !end) return null
    return [start, end]
  },
  set(val) {
    const [startKey, endKey] = getRangeKeys()
    if (!val?.length) {
      model.value[startKey] = undefined
      model.value[endKey] = undefined
      return
    }
    model.value[startKey] = val[0]
    model.value[endKey] = val[1]
  }
})
</script>

<template>
  <el-date-picker
    v-model="rangeValue"
    type="datetimerange"
    value-format="YYYY-MM-DD HH:mm:ss"
    format="YYYY-MM-DD HH:mm:ss"
    :start-placeholder="item.startPlaceholder ?? '开始时间'"
    :end-placeholder="item.endPlaceholder ?? '结束时间'"
    range-separator="至"
    clearable
    class="search-filter-full"
    v-bind="item.props"
  />
</template>
