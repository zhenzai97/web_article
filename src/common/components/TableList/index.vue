<script setup>
import { usePagination } from "@@/composables/usePagination"
import { omit } from "lodash-es"

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  api: {
    type: Function,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  },
  immediate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(["selectionChange"])

const loading = ref(false)
const tableData = ref([])

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function getColumnProps(column) {
  return omit(column, ["slot"])
}

function fetchData() {
  loading.value = true
  props.api({
    current: paginationData.current,
    pageSize: paginationData.pageSize,
    ...props.params
  }).then(({ data }) => {
    paginationData.total = Number(data.total)
    tableData.value = data.records
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}

/** 查询：重置到第一页并刷新 */
function search() {
  if (paginationData.current === 1) {
    fetchData()
  } else {
    paginationData.current = 1
  }
}

/** 刷新：保持当前页 */
function refresh() {
  fetchData()
}

watch(
  [() => paginationData.current, () => paginationData.pageSize],
  fetchData,
  { immediate: props.immediate }
)

defineExpose({ search, refresh, fetchData })
</script>

<template>
  <div class="table-list">
    <div class="table-wrapper">
      <el-table
        stripe
        v-loading="loading"
        :data="tableData"
        @selection-change="rows => emit('selectionChange', rows)"
      >
        <template v-for="column in columns" :key="column.prop ?? column.label ?? column.type">
          <el-table-column v-bind="getColumnProps(column)">
            <template v-if="column.slot" #default="scope">
              <slot :name="column.slot" v-bind="scope" />
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="pager-wrapper">
      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :current-page="paginationData.current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
