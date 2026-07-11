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
  <el-input
    v-model="model[item.value]"
    clearable
    :placeholder="item.placeholder ?? '请输入'"
    class="search-filter-full"
    v-bind="item.props"
  />
</template>
