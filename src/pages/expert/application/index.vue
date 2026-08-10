<script setup>
import { deleteExpertApplyApi, getExpertApplyListApi } from "@@/apis/expert-apply"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { EXPERT_PLATFORM_OPTIONS } from "@@/constants/expert"
import { PERM } from "@@/constants/permission"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "ExpertApplication"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  realName: "",
  mobile: "",
  field: "",
  plat: "",
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "达人昵称", component: "input", value: "name" },
  { label: "真实姓名", component: "input", value: "realName" },
  { label: "联系电话", component: "input", value: "mobile" },
  { label: "擅长领域", component: "input", value: "field" },
  {
    label: "所属平台",
    component: "select",
    value: "plat",
    options: EXPERT_PLATFORM_OPTIONS
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
  { prop: "name", label: "达人昵称", align: "left", minWidth: 120 },
  { prop: "realName", label: "真实姓名", align: "center", width: 100 },
  { prop: "mobile", label: "联系电话", align: "center", minWidth: 120 },
  { prop: "fansNum", label: "粉丝数", align: "center", width: 100 },
  { prop: "field", label: "擅长领域", align: "left", minWidth: 120, showOverflowTooltip: true },
  { prop: "plat", label: "平台", align: "left", slot: "plat", minWidth: 160 },
  { prop: "intro", label: "简介", align: "left", minWidth: 160, showOverflowTooltip: true },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function getPlatLabel(value) {
  return EXPERT_PLATFORM_OPTIONS.find(item => item.value === value)?.label || value
}

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
  ElMessageBox.confirm(`正在删除达人申请：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteExpertApplyApi(row.id).then(() => {
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
        cache-key="expert-application-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.expertApplication.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增申请
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getExpertApplyListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #plat="{ row }">
          <template v-if="row.plat?.length">
            <el-tag
              v-for="item in row.plat"
              :key="item"
              size="small"
              class="plat-tag"
            >
              {{ getPlatLabel(item) }}
            </el-tag>
          </template>
          <span v-else>-</span>
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.expertApplication.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.expertApplication.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>

<style lang="scss" scoped>
.plat-tag {
  margin: 2px 4px 2px 0;
}
</style>
