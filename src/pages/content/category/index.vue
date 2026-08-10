<script setup>
import { PERM } from "@@/constants/permission"
import { deleteArticleCatApi, getArticleCatListApi } from "@@/apis/article-cats"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "ContentCategory"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  sign: "",
  name: "",
  status: undefined
})

const searchItems = [
  { label: "分类标识", component: "input", value: "sign", placeholder: "如 xhdt" },
  { label: "分类名称", component: "input", value: "name" },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: [
      { label: "启用", value: 1 },
      { label: "停用", value: 0 }
    ]
  }
]

const columns = [
  { prop: "sign", label: "分类标识", align: "center", minWidth: 120 },
  { prop: "name", label: "分类名称", align: "center", minWidth: 140 },
  { prop: "sort", label: "排序", align: "center", width: 80 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 90 },
  { prop: "remark", label: "备注", align: "center", minWidth: 160 },
  { prop: "createTime", label: "创建时间", align: "center", minWidth: 160 },
  { label: "操作", width: 150, align: "center", fixed: "right", slot: "action" }
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
  ElMessageBox.confirm(`正在删除分类：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteArticleCatApi(row.id).then(() => {
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
        cache-key="content-category-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.contentCategory.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增分类
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getArticleCatListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #status="{ row }">
          <el-tag v-if="row.status === 1" type="success" effect="plain" disable-transitions>
            启用
          </el-tag>
          <el-tag v-else type="info" effect="plain" disable-transitions>
            停用
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.contentCategory.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-permission="PERM.contentCategory.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
