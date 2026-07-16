<script setup>
import { deleteAdvertisingApi, getAdvertisingListApi } from "@@/apis/advertising"
import { getAdvertisingSpaceAllApi } from "@@/apis/advertising-space"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import VideoDisplay from "@@/components/VideoDisplay/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "Advertising"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)
const spaceOptions = ref([])

const searchData = reactive({
  name: "",
  spaceId: "",
  status: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined,
  sStartTime: undefined,
  sEndTime: undefined,
  eStartTime: undefined,
  eEndTime: undefined
})

const dateRangeProps = {
  "type": "daterange",
  "value-format": "YYYY-MM-DD",
  "format": "YYYY-MM-DD"
}

const searchItems = computed(() => [
  { label: "广告标题", component: "input", value: "name" },
  {
    label: "运营位",
    component: "select",
    value: "spaceId",
    options: spaceOptions.value.map(item => ({
      label: `${item.name} (${item.sign})`,
      value: item.id
    }))
  },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: ENABLE_STATUS_OPTIONS
  },
  {
    label: "开始日期",
    value: "showStartTime",
    values: ["sStartTime", "sEndTime"],
    component: "date",
    span: 8,
    startPlaceholder: "开始日期起",
    endPlaceholder: "开始日期止",
    props: dateRangeProps
  },
  {
    label: "结束日期",
    value: "showEndTime",
    values: ["eStartTime", "eEndTime"],
    component: "date",
    span: 8,
    startPlaceholder: "结束日期起",
    endPlaceholder: "结束日期止",
    props: dateRangeProps
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
])

const columns = [
  { prop: "cover", label: "封面", align: "center", slot: "cover", width: 90 },
  { prop: "name", label: "广告标题", align: "left", minWidth: 200 },
  { prop: "spaceName", label: "运营位", align: "center", minWidth: 140 },
  { prop: "video", label: "视频", align: "center", slot: "video", width: 90 },
  { prop: "path", label: "跳转路径", align: "left", minWidth: 160 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
  { prop: "startTime", label: "开始日期", align: "center", minWidth: 120 },
  { prop: "endTime", label: "结束日期", align: "center", minWidth: 120 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

async function loadSpaces() {
  try {
    const { data } = await getAdvertisingSpaceAllApi()
    spaceOptions.value = data
  } catch {
    spaceOptions.value = []
  }
}

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
  ElMessageBox.confirm(`正在删除广告：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAdvertisingApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}

onMounted(loadSpaces)
</script>

<template>
  <PageLayout>
    <template #search>
      <SearchForm
        v-model="searchData"
        :items="searchItems"
        :loading="tableLoading"
        cache-key="operation-advertising-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
        新增广告
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getAdvertisingListApi"
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
        <template #video="{ row }">
          <VideoDisplay :src="row.video" />
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
  <FormDialog ref="formDialogRef" :spaces="spaceOptions" @success="tableListRef?.refresh()" />
</template>
