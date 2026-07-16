<script setup>
import { deleteTourismContentApi, getTourismContentListApi } from "@@/apis/tourism-content"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "TourismContent"
})

const route = useRoute()
const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  type: route.query.type ? String(route.query.type) : "",
  status: undefined,
  isRecommend: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "名称", component: "input", value: "name" },
  {
    label: "类型",
    component: "select",
    value: "type",
    options: TOURISM_TYPE_OPTIONS
  },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: ENABLE_STATUS_OPTIONS
  },
  {
    label: "推荐",
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
  { prop: "name", label: "名称", align: "left", minWidth: 160 },
  { prop: "type", label: "类型", align: "center", slot: "type", width: 100 },
  { prop: "intro", label: "简介", align: "left", minWidth: 180, showOverflowTooltip: true },
  { prop: "isRecommend", label: "推荐", align: "center", slot: "recommend", width: 70 },
  { prop: "readCount", label: "阅读", align: "center", width: 70 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
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
    deleteTourismContentApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}

watch(
  () => route.query.type,
  (type) => {
    const nextType = type ? String(type) : ""
    if (searchData.type === nextType) {
      return
    }
    searchData.type = nextType
    nextTick(() => tableListRef.value?.search())
  }
)
</script>

<template>
  <PageLayout>
    <template #search>
      <SearchForm
        v-model="searchData"
        :items="searchItems"
        :loading="tableLoading"
        cache-key="content-tourism-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
        新增内容
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getTourismContentListApi"
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
        <template #type="{ row }">
          <OptionLabel :options="TOURISM_TYPE_OPTIONS" :value="row.type" />
        </template>
        <template #recommend="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isRecommend" />
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
