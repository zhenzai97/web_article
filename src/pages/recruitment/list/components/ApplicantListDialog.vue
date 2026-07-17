<script setup>
import { getApplicantListApi } from "@@/apis/applicant"
import TableList from "@@/components/TableList/index.vue"

const visible = ref(false)
const title = ref("应聘列表")
const tableListRef = useTemplateRef("tableListRef")
const tableLoading = ref(false)

const searchData = reactive({
  recruitmentId: undefined
})

const columns = [
  { prop: "name", label: "应聘人", align: "left", minWidth: 110 },
  { prop: "mobile", label: "联系电话", align: "center", minWidth: 120 },
  { prop: "salaryRange", label: "期望薪资", align: "center", minWidth: 110 },
  { prop: "companyName", label: "公司", align: "left", minWidth: 130 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 }
]

function show(row) {
  searchData.recruitmentId = row?.id
  title.value = row?.name ? `应聘列表 - ${row.name}` : "应聘列表"
  visible.value = true
  nextTick(() => {
    tableListRef.value?.search()
  })
}

function close() {
  visible.value = false
  searchData.recruitmentId = undefined
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
    <div v-loading="tableLoading" class="applicant-dialog-table">
      <TableList
        v-if="visible && searchData.recruitmentId"
        ref="tableListRef"
        :columns="columns"
        :api="getApplicantListApi"
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
.applicant-dialog-table {
  min-height: 280px;
}
</style>
