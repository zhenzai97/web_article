<script setup>
import { deleteAssociationConfigApi, getAssociationConfigListApi } from "@@/apis/association-config"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "AssociationConfig"
})

const CONTENT_FIELDS = [
  { key: "intro", label: "简介" },
  { key: "purpose", label: "宗旨" },
  { key: "business", label: "业务" },
  { key: "remark", label: "说明" }
]

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
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
  { label: "协会名称", component: "input", value: "name" },
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
  { prop: "name", label: "协会名称", align: "left", minWidth: 160 },
  { prop: "mobile", label: "电话", align: "center", minWidth: 120 },
  { prop: "email", label: "邮箱", align: "left", minWidth: 140, showOverflowTooltip: true },
  { prop: "workTime", label: "工作时间", align: "center", width: 120 },
  { prop: "wxAccount", label: "微信码", align: "center", slot: "wxAccount", width: 80 },
  { prop: "contentFlags", label: "图文配置", align: "left", slot: "contentFlags", minWidth: 220 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 80 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function hasContent(html) {
  if (!html) return false
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "").trim().length > 0
}

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
  ElMessageBox.confirm(`确认删除协会配置：${row.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAssociationConfigApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}
</script>

<template>
  <PageLayout>
    <template #search>
      <div class="config-search">
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
          cache-key="association-config-search"
          label-width="80px"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </template>

    <template #toolbar>
      <div class="toolbar-row">
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
          新增配置
        </el-button>
        <span class="tip">建议仅保留一条启用配置，供小程序关于我们/联系页读取</span>
      </div>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getAssociationConfigListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #wxAccount="{ row }">
          <ImageDisplay :src="row.wxAccount" :width="48" :height="48" />
        </template>
        <template #contentFlags="{ row }">
          <el-tag
            v-for="item in CONTENT_FIELDS"
            :key="item.key"
            size="small"
            class="flag-tag"
            :type="hasContent(row[item.key]) ? 'success' : 'info'"
            effect="plain"
          >
            {{ item.label }}
          </el-tag>
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
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

<style lang="scss" scoped>
.config-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-filter {
  flex-shrink: 0;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.flag-tag {
  margin: 2px 6px 2px 0;
}
</style>
