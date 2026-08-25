<script setup>
import { deleteActivityApi, getActivityListApi } from "@@/apis/activity"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "ContentActivity"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  title: "",
  status: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "标题", component: "input", value: "title" },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: ENABLE_STATUS_OPTIONS
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
  { prop: "title", label: "标题", align: "left", minWidth: 200 },
  { prop: "intro", label: "简介", align: "left", minWidth: 180, showOverflowTooltip: true },
  { prop: "bmStartTime", label: "报名开始", align: "center", minWidth: 160 },
  { prop: "bmEndTime", label: "报名结束", align: "center", minWidth: 160 },
  { prop: "startTime", label: "活动开始", align: "center", minWidth: 160 },
  { prop: "endTime", label: "活动结束", align: "center", minWidth: 160 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 80 },
  { prop: "sort", label: "排序", align: "center", width: 70 },
  { prop: "readCount", label: "阅读", align: "center", width: 80 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { label: "操作", width: 220, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row, "edit")
}

function handleViewRegistration(row) {
  formDialogRef.value?.show(row, "registration")
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteActivityApi(row.id).then(() => {
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
        cache-key="content-activity-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.contentActivity.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增活动
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getActivityListApi"
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
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #action="{ row }">
          <el-button type="primary" text bg size="small" @click="handleViewRegistration(row)">
            查看报名
          </el-button>
          <el-button v-permission="PERM.contentActivity.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.contentActivity.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
