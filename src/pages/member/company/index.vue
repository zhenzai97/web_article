<script setup>
import { deleteCompanyApi, getCompanyListApi } from "@@/apis/company"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import {
  COMPANY_TAG_OPTIONS,
  EXAMINE_STATUS_OPTIONS,
  VIP_OPTIONS,
  VIP_TYPE_OPTIONS
} from "@@/constants/company"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "Company"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  nickname: "",
  mobile: "",
  vipType: undefined,
  vip: undefined,
  examineStatus: undefined,
  status: undefined,
  tag: "",
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

/** 审核状态快捷筛选：全部 + 待审核 / 已通过 / 已拒绝 */
const examineStatusFilterOptions = [
  { label: "全部", value: "" },
  ...EXAMINE_STATUS_OPTIONS
]

const examineStatusFilter = computed({
  get: () => (searchData.examineStatus === undefined || searchData.examineStatus === null
    ? ""
    : searchData.examineStatus),
  set: (value) => {
    searchData.examineStatus = value === "" ? undefined : value
  }
})

const searchItems = [
  { label: "名称", component: "input", value: "name" },
  { label: "简称/昵称", component: "input", value: "nickname" },
  { label: "联系电话", component: "input", value: "mobile" },
  {
    label: "会员类型",
    component: "select",
    value: "vipType",
    options: VIP_TYPE_OPTIONS
  },
  {
    label: "会员属性",
    component: "select",
    value: "vip",
    options: VIP_OPTIONS
  },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: ENABLE_STATUS_OPTIONS
  },
  {
    label: "标签",
    component: "select",
    value: "tag",
    options: COMPANY_TAG_OPTIONS
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
  { prop: "cover", label: "封面", align: "center", slot: "cover", width: 90 },
  { prop: "name", label: "名称", align: "left", minWidth: 160 },
  { prop: "nickname", label: "简称/昵称", align: "left", minWidth: 120 },
  { prop: "vipType", label: "会员类型", align: "center", slot: "vipType", width: 100 },
  { prop: "vip", label: "会员属性", align: "center", slot: "vip", width: 110 },
  { prop: "mobile", label: "电话", align: "center", minWidth: 120 },
  { prop: "examineStatus", label: "审核", align: "center", slot: "examine", width: 90 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
}

function handleExamineStatusChange() {
  handleSearch()
}

function handleReset() {
  searchData.examineStatus = undefined
  handleSearch()
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCompanyApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}
</script>

<template>
  <PageLayout>
    <template #search>
      <div class="company-search">
        <el-radio-group
          v-model="examineStatusFilter"
          class="examine-status-filter"
          @change="handleExamineStatusChange"
        >
          <el-radio-button
            v-for="item in examineStatusFilterOptions"
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
          cache-key="operation-company-search"
          label-width="80px"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.memberCompany.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增会员
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getCompanyListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #cover="{ row }">
          <ImageDisplay
            :src="row.cover"
            :width="60"
            :height="60"
            fit="cover"
            :radius="4"
          />
        </template>
        <template #vipType="{ row }">
          <OptionLabel :options="VIP_TYPE_OPTIONS" :value="row.vipType" />
        </template>
        <template #vip="{ row }">
          <OptionLabel :options="VIP_OPTIONS" :value="row.vip" />
        </template>
        <template #examine="{ row }">
          <OptionLabel :options="EXAMINE_STATUS_OPTIONS" :value="row.examineStatus" />
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.memberCompany.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.memberCompany.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>

<style lang="scss" scoped>
.company-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.examine-status-filter {
  flex-shrink: 0;
}
</style>
