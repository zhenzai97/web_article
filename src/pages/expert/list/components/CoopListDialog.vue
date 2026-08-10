<script setup>
import { getExpertCoopListByExpertApi } from "@@/apis/expert"
import TableList from "@@/components/TableList/index.vue"

const visible = ref(false)
const title = ref("合作申请")
const tableLoading = ref(false)

const searchData = reactive({
  expertId: undefined
})

const columns = [
  { prop: "name", label: "申请人", align: "left", minWidth: 110 },
  { prop: "company", label: "公司/品牌", align: "left", minWidth: 140 },
  { prop: "mobile", label: "联系电话", align: "center", minWidth: 120 },
  { prop: "matter", label: "合作事宜", align: "left", minWidth: 180, showOverflowTooltip: true },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 }
]

function show(row) {
  searchData.expertId = row?.id
  title.value = row?.name ? `合作申请 - ${row.name}` : "合作申请"
  visible.value = true
}

function close() {
  visible.value = false
  searchData.expertId = undefined
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="860px"
    destroy-on-close
    @closed="close"
  >
    <div v-loading="tableLoading" class="coop-dialog-table">
      <TableList
        v-if="visible && searchData.expertId"
        :columns="columns"
        :api="getExpertCoopListByExpertApi"
        :params="searchData"
        :immediate="true"
        :auto-height="false"
        :height="400"
        :sync-search-collapse="false"
        @loading-change="tableLoading = $event"
      />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.coop-dialog-table {
  min-height: 280px;
}
</style>
