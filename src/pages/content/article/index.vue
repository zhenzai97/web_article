<script setup>
import { getArticleCatAllApi } from "@@/apis/article-cats"
import {
  batchDeleteArticleApi,
  deleteArticleApi,
  getArticleListApi
} from "@@/apis/articles"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import VideoDisplay from "@@/components/VideoDisplay/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { CirclePlus, Delete } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "ContentArticle"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const categoryOptions = ref([])

const searchData = reactive({
  title: "",
  cateId: "",
  status: undefined,
  isHome: undefined,
  isTop: undefined,
  author: "",
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = computed(() => [
  { label: "标题", component: "input", value: "title" },
  {
    label: "栏目",
    component: "select",
    value: "cateId",
    options: categoryOptions.value.map(item => ({
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
    label: "首页推荐",
    component: "select",
    value: "isHome",
    options: YES_NO_OPTIONS
  },
  {
    label: "置顶",
    component: "select",
    value: "isTop",
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
    label: "修改时间",
    value: "updateTime",
    values: ["upStartTime", "upEndTime"],
    component: "date",
    span: 8
  }
])

const columns = [
  { type: "selection", width: 50, align: "center" },
  { prop: "cover", label: "封面", align: "center", slot: "cover", width: 90 },
  { prop: "title", label: "标题", align: "left", minWidth: 200 },
  { prop: "categoryName", label: "文章分类", align: "center", minWidth: 120 },
  { prop: "video", label: "视频", align: "center", slot: "video", width: 90 },
  { prop: "isTop", label: "置顶", align: "center", slot: "isTop", width: 70 },
  { prop: "isHome", label: "首页推荐", align: "center", slot: "isHome", width: 90 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 70 },
  { prop: "sort", label: "排序", align: "center", width: 50 },
  { prop: "readNum", label: "阅读量", align: "center", width: 90 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { prop: "updateTime", label: "修改时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

const selectedRows = ref([])

async function loadCategories() {
  try {
    const { data } = await getArticleCatAllApi()
    categoryOptions.value = data
  } catch {
    categoryOptions.value = []
  }
}

function handleSearch() {
  tableListRef.value?.search()
}

function handleSelectionChange(rows) {
  selectedRows.value = rows
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除文章：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteArticleApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}

function handleBatchDelete() {
  if (!selectedRows.value.length) {
    ElMessage.warning("请先选择要删除的文章")
    return
  }
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 篇文章？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    batchDeleteArticleApi(selectedRows.value.map(item => item.id)).then(() => {
      ElMessage.success("批量删除成功")
      tableListRef.value?.refresh()
    })
  })
}

onMounted(loadCategories)
</script>

<template>
  <PageLayout>
    <template #search>
      <SearchForm
        v-model="searchData"
        :items="searchItems"
        cache-key="content-article-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <div>
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
          新增文章
        </el-button>
        <el-button type="danger" :icon="Delete" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getArticleListApi"
        :params="searchData"
        @selection-change="handleSelectionChange"
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
          <VideoDisplay
            :src="row.video"
          />
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #isTop="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isTop" />
        </template>
        <template #isHome="{ row }">
          <OptionLabel :options="YES_NO_OPTIONS" :value="row.isHome" />
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
    <FormDialog ref="formDialogRef" :categories="categoryOptions" @success="tableListRef?.refresh()" />
  </PageLayout>
</template>
