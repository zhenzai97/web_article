<script setup>
import { deleteExpertApi, getExpertListApi } from "@@/apis/expert"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import VideoDisplay from "@@/components/VideoDisplay/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import { EXPERT_PLATFORM_OPTIONS } from "@@/constants/expert"
import { CirclePlus } from "@element-plus/icons-vue"
import CoopListDialog from "./components/CoopListDialog.vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "ExpertList"
})

const formDialogRef = useTemplateRef("formDialogRef")
const coopListDialogRef = useTemplateRef("coopListDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  plat: "",
  isJade: undefined,
  isRecommend: undefined,
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
  { label: "达人名称", component: "input", value: "name" },
  {
    label: "所属平台",
    component: "select",
    value: "plat",
    options: EXPERT_PLATFORM_OPTIONS
  },
  {
    label: "玉石达人",
    component: "select",
    value: "isJade",
    options: YES_NO_OPTIONS
  },
  {
    label: "是否推荐",
    component: "select",
    value: "isRecommend",
    options: YES_NO_OPTIONS
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
  { prop: "video", label: "视频", align: "center", slot: "video", width: 90 },
  { prop: "name", label: "达人名称", align: "left", minWidth: 140 },
  { prop: "plat", label: "平台", align: "left", slot: "plat", minWidth: 180 },
  { prop: "intro", label: "简介", align: "left", minWidth: 180, showOverflowTooltip: true },
  { prop: "coopCount", label: "合作申请", align: "center", slot: "coopCount", width: 100 },
  { prop: "isJade", label: "玉石", align: "center", slot: "isJade", width: 70 },
  { prop: "isRecommend", label: "推荐", align: "center", slot: "isRecommend", width: 70 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
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
  ElMessageBox.confirm(`正在删除达人：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteExpertApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}

function handleCoopList(row) {
  coopListDialogRef.value?.show(row)
}
</script>

<template>
  <PageLayout>
    <template #search>
      <div class="expert-search">
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
          cache-key="expert-list-search"
          label-width="80px"
          @search="handleSearch"
          @reset="handleReset"
        />
      </div>
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.expertList.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增达人
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getExpertListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #cover="{ row }">
          <ImageDisplay :src="row.cover" :width="56" :height="56" />
        </template>
        <template #video="{ row }">
          <VideoDisplay :src="row.video" />
        </template>
        <template #coopCount="{ row }">
          <el-button type="primary" link @click="handleCoopList(row)">
            {{ row.coopCount ?? 0 }}
          </el-button>
        </template>
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
        <template #isJade="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isJade" />
        </template>
        <template #isRecommend="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isRecommend" />
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.expertList.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.expertList.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
  <CoopListDialog ref="coopListDialogRef" />
</template>

<style lang="scss" scoped>
.expert-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-filter {
  flex-shrink: 0;
}

.plat-tag {
  margin: 2px 4px 2px 0;
}
</style>
