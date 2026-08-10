<script setup>
import { deleteJadeCommitteeConfigApi, getJadeCommitteeConfigListApi } from "@@/apis/jade-committee-config"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "JadeCommitteeConfig"
})

const CONTENT_FIELDS = [
  { key: "description", label: "简介" },
  { key: "mission", label: "使命" },
  { key: "business", label: "业务" },
  { key: "needKnow", label: "须知" },
  { key: "privacyPolicy", label: "隐私政策" }
]

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  contact: "",
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
  { label: "联系人", component: "input", value: "contact" },
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
  { prop: "contact", label: "联系人", align: "left", minWidth: 120 },
  { prop: "mobile", label: "电话", align: "center", minWidth: 120 },
  { prop: "isJump", label: "是否跳转", align: "center", slot: "isJump", width: 90 },
  { prop: "contentFlags", label: "图文配置", align: "left", slot: "contentFlags", minWidth: 260 },
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
  ElMessageBox.confirm(`确认删除该专委会配置？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteJadeCommitteeConfigApi(row.id).then(() => {
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
          cache-key="jade-committee-config-search"
          label-width="80px"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </template>

    <template #toolbar>
      <div class="toolbar-row">
        <el-button v-permission="PERM.jadeCommitteeConfig.add" type="primary" :icon="CirclePlus" @click="handleAdd">
          新增配置
        </el-button>
        <span class="tip">建议仅保留一条启用配置，供小程序专委会页读取</span>
      </div>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getJadeCommitteeConfigListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #isJump="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isJump" />
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
          <el-button v-permission="PERM.jadeCommitteeConfig.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.jadeCommitteeConfig.delete" type="danger" text bg size="small" @click="handleDelete(row)">
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
