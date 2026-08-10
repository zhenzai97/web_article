<script setup>
import RemoteSelect from "@@/components/RemoteSelect/index.vue"

defineProps({
  item: {
    type: Object,
    required: true
  }
})

const model = inject("searchFormModel")
</script>

<template>
  <RemoteSelect
    v-model="model[item.value]"
    :api="item.api"
    :value-field="item.valueField ?? 'id'"
    :label-field="item.labelField ?? 'name'"
    :keyword-field="item.keywordField ?? 'keyword'"
    :page-size="item.pageSize ?? 10"
    :params="item.params"
    :scroll-loading="item.scrollLoading ?? true"
    :remote-search="item.remoteSearch ?? true"
    :not-match-data="item.notMatchData"
    :placeholder="item.placeholder ?? '请选择'"
    :clearable="item.clearable ?? true"
    class="search-filter-full"
    v-bind="item.props"
  />
</template>
