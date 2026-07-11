<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

const model = inject("searchFormModel")
</script>

<template>
  <el-select
    v-model="model[item.value]"
    clearable
    :placeholder="item.placeholder ?? '请选择'"
    class="search-filter-full"
    v-bind="item.props"
  >
    <el-option
      v-for="option in item.options"
      :key="String(option.value)"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>
