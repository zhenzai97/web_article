<script setup>
import { deleteUserApi, getUserListApi } from "@@/apis/users"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { CirclePlus, Delete } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "SystemUser"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  userAccount: "",
  userName: ""
})

const searchItems = [
  { label: "用户账号", component: "input", value: "userAccount" },
  { label: "用户昵称", component: "input", value: "userName" }
]

const columns = [
  { type: "selection", width: 50, align: "center" },
  { prop: "userAccount", label: "用户账号", align: "center", minWidth: 120 },
  { prop: "userName", label: "用户昵称", align: "center", minWidth: 100 },
  { prop: "userRole", label: "用户角色", align: "center", slot: "userRole", minWidth: 100 },
  { prop: "userProfile", label: "用户简介", align: "center", minWidth: 140 },
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
  const displayName = row.userName || row.userAccount
  ElMessageBox.confirm(`正在删除用户：${displayName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserApi(row.id).then(() => {
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
        cache-key="system-user-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <div>
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
          新增用户
        </el-button>
        <el-button type="danger" :icon="Delete">
          批量删除
        </el-button>
      </div>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getUserListApi"
        :params="searchData"
        @loading-change="tableLoading = $event"
      >
        <template #userRole="{ row }">
          <el-tag v-if="row.userRole === 'admin'" type="primary" effect="plain" disable-transitions>
            admin
          </el-tag>
          <el-tag v-else type="info" effect="plain" disable-transitions>
            {{ row.userRole }}
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
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
