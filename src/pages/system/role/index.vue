<script setup>
import { deleteRoleApi, getRoleListApi } from "@@/apis/roles"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { CirclePlus, Delete } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "SystemRole"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const searchData = reactive({
  roleName: ""
})

const searchItems = [
  { label: "角色名称", component: "input", value: "roleName" }
]

const columns = [
  { type: "selection", width: 50, align: "center" },
  { prop: "roleCode", label: "角色编码", align: "center", minWidth: 120 },
  { prop: "roleName", label: "角色名称", align: "center", minWidth: 120 },
  { prop: "roleDesc", label: "角色描述", align: "center", minWidth: 160 },
  { prop: "status", label: "状态", align: "center", slot: "status", minWidth: 80 },
  { prop: "sort", label: "排序", align: "center", minWidth: 80 },
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
  ElMessageBox.confirm(`正在删除角色：${row.roleName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRoleApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <SearchForm
        v-model="searchData"
        :items="searchItems"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
            新增角色
          </el-button>
          <el-button type="danger" :icon="Delete">
            批量删除
          </el-button>
        </div>
      </div>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getRoleListApi"
        :params="searchData"
      >
        <template #status="{ row }">
          <el-tag v-if="row.status === 1" type="success" effect="plain" disable-transitions>
            启用
          </el-tag>
          <el-tag v-else type="danger" effect="plain" disable-transitions>
            禁用
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button type="primary" text bg size="small" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </el-card>
    <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
