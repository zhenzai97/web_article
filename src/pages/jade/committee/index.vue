<script setup>
import { deleteJadeCommitteeApi, getJadeCommitteeListApi } from "@@/apis/jade-committee"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { PERM } from "@@/constants/permission"
import { JADE_VIP_ATTRIBUTE_OPTIONS } from "@@/constants/jade"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "JadeCommittee"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  contact: "",
  status: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "名称", component: "input", value: "name" },
  { label: "联系人", component: "input", value: "contact" },
  {
    label: "状态",
    component: "select",
    value: "status",
    options: ENABLE_STATUS_OPTIONS
  }
]

const columns = [
  { prop: "cover", label: "封面", align: "center", slot: "cover", width: 90 },
  { prop: "name", label: "名称", align: "left", minWidth: 140 },
  { prop: "contact", label: "联系人", align: "center", width: 100 },
  { prop: "contactInfo", label: "联系方式", align: "center", minWidth: 120 },
  { prop: "business", label: "业务", align: "left", minWidth: 140, showOverflowTooltip: true },
  { prop: "vipAttribute", label: "会员属性", align: "center", slot: "vipAttribute", width: 90 },
  { prop: "status", label: "状态", align: "center", slot: "status", width: 80 },
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
    deleteJadeCommitteeApi(row.id).then(() => {
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
        cache-key="jade-committee-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleSearch"
      />
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.jadeCommittee.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增专委会
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getJadeCommitteeListApi"
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
        <template #vipAttribute="{ row }">
          <OptionLabel :options="JADE_VIP_ATTRIBUTE_OPTIONS" :value="row.vipAttribute" />
        </template>
        <template #status="{ row }">
          <OptionLabel :options="ENABLE_STATUS_OPTIONS" :value="row.status" />
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.jadeCommittee.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.jadeCommittee.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
