<script setup>
import { deleteApplicantApi, getApplicantListApi } from "@@/apis/applicant"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { SALARY_RANGE_OPTIONS } from "@@/constants/recruitment"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "RecruitmentApplicant"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  mobile: "",
  companyId: undefined,
  recruitmentId: undefined,
  salaryRange: "",
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "应聘人", component: "input", value: "name" },
  { label: "联系电话", component: "input", value: "mobile" },
  {
    label: "期望薪资",
    component: "select",
    value: "salaryRange",
    options: SALARY_RANGE_OPTIONS
  },
  {
    label: "创建时间",
    value: "createTime",
    values: ["cStartTime", "cEndTime"],
    component: "date",
    span: 8
  },
  {
    label: "更新时间",
    value: "updateTime",
    values: ["upStartTime", "upEndTime"],
    component: "date",
    span: 8
  }
]

const columns = [
  { prop: "name", label: "应聘人", align: "left", minWidth: 120 },
  { prop: "mobile", label: "联系电话", align: "center", minWidth: 130 },
  { prop: "salaryRange", label: "期望薪资", align: "center", minWidth: 120 },
  { prop: "companyName", label: "公司", align: "left", minWidth: 140 },
  { prop: "recruitmentName", label: "应聘岗位", align: "left", minWidth: 160 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
}

function handleReset() {
  handleSearch()
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除应聘记录：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteApplicantApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}
</script>

<template>
  <PageLayout>
    <template #search>
      <SearchForm
        v-model="searchData"
        :items="searchItems"
        :loading="tableLoading"
        cache-key="recruitment-applicant-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>

    <template #toolbar>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
        新增应聘
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getApplicantListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #action="{ row }">
          <el-button type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
