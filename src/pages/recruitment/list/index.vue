<script setup>
import { deleteRecruitmentApi, getRecruitmentListApi } from "@@/apis/recruitment"
import { getCompanyListApi } from "@@/apis/company"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import {
  QUALIFICATION_OPTIONS,
  SALARY_RANGE_OPTIONS,
  WORKING_HOURS_OPTIONS
} from "@@/constants/recruitment"
import { CirclePlus } from "@element-plus/icons-vue"
import ApplicantListDialog from "./components/ApplicantListDialog.vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "RecruitmentList"
})

const formDialogRef = useTemplateRef("formDialogRef")
const applicantListDialogRef = useTemplateRef("applicantListDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  companyId: undefined,
  salaryRange: "",
  workingHours: "",
  qualification: "",
  status: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const statusFilterOptions = [
  { label: "全部", value: "" },
  ...ENABLE_STATUS_OPTIONS
]

const statusFilter = computed({
  get: () => (searchData.status === undefined || searchData.status === null ? "" : searchData.status),
  set: (value) => {
    searchData.status = value === "" ? undefined : value
  }
})

const searchItems = [
  { label: "岗位名称", component: "input", value: "name" },
  {
    label: "公司",
    component: "remoteSelect",
    value: "companyId",
    api: getCompanyListApi,
    valueField: "id",
    labelField: "name",
    keywordField: "name",
    pageSize: 10,
    params: {
      status: 1,
      examineStatus: 1
    },
    placeholder: "请选择公司"
  },
  {
    label: "薪资范围",
    component: "select",
    value: "salaryRange",
    options: SALARY_RANGE_OPTIONS
  },
  {
    label: "工作经验",
    component: "select",
    value: "workingHours",
    options: WORKING_HOURS_OPTIONS
  },
  {
    label: "学历",
    component: "select",
    value: "qualification",
    options: QUALIFICATION_OPTIONS
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
  { prop: "name", label: "岗位名称", align: "left", minWidth: 160 },
  { prop: "companyName", label: "公司", align: "left", minWidth: 140 },
  { prop: "salaryRange", label: "薪资", align: "center", minWidth: 110 },
  { prop: "workingHours", label: "经验", align: "center", width: 100 },
  { prop: "qualification", label: "学历", align: "center", width: 110 },
  { prop: "applicantCount", label: "应聘人数", align: "center", slot: "applicantCount", width: 100 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
}

function handleStatusChange() {
  handleSearch()
}

function handleReset() {
  searchData.status = undefined
  handleSearch()
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除岗位：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRecruitmentApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}

function handleApplicantList(row) {
  applicantListDialogRef.value?.show(row)
}
</script>

<template>
  <PageLayout>
    <template #search>
      <div class="recruitment-search">
        <el-radio-group
          v-model="statusFilter"
          class="status-filter"
          @change="handleStatusChange"
        >
          <el-radio-button
            v-for="item in statusFilterOptions"
            :key="String(item.value)"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>

        <SearchForm
          v-model="searchData"
          :items="searchItems"
          :loading="tableLoading"
          cache-key="recruitment-list-search"
          label-width="80px"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.recruitmentList.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增招聘
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getRecruitmentListApi"
        :params="searchData"
        :page-size="50"
        @loading-change="tableLoading = $event"
      >
        <template #applicantCount="{ row }">
          <el-button type="primary" link @click="handleApplicantList(row)">
            {{ row.applicantCount ?? 0 }}
          </el-button>
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.recruitmentList.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.recruitmentList.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
  <ApplicantListDialog ref="applicantListDialogRef" />
</template>

<style lang="scss" scoped>
.recruitment-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-filter {
  flex-shrink: 0;
}
</style>
