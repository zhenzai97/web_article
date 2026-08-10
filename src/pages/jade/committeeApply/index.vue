<script setup>
import { deleteJadeCommitteeApplyApi, getJadeCommitteeApplyListApi } from "@@/apis/jade-committee-apply"
import ImageDisplay from "@@/components/ImageDisplay/index.vue"
import OptionLabel from "@@/components/OptionLabel/index.vue"
import PageLayout from "@@/components/PageLayout/index.vue"
import SearchForm from "@@/components/SearchForm/index.vue"
import TableList from "@@/components/TableList/index.vue"
import { JADE_AUDIT_RESULT_OPTIONS, JADE_VIP_ATTRIBUTE_OPTIONS } from "@@/constants/jade"
import { PERM } from "@@/constants/permission"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "JadeCommitteeApply"
})

const formDialogRef = useTemplateRef("formDialogRef")
const tableListRef = useTemplateRef("tableListRef")

const tableLoading = ref(false)

const searchData = reactive({
  name: "",
  contact: "",
  auditResult: undefined,
  vipAttribute: undefined,
  cStartTime: undefined,
  cEndTime: undefined,
  upStartTime: undefined,
  upEndTime: undefined
})

const searchItems = [
  { label: "名称", component: "input", value: "name" },
  { label: "联系人", component: "input", value: "contact" },
  {
    label: "审核状态",
    component: "select",
    value: "auditResult",
    options: JADE_AUDIT_RESULT_OPTIONS
  },
  {
    label: "会员属性",
    component: "select",
    value: "vipAttribute",
    options: JADE_VIP_ATTRIBUTE_OPTIONS
  }
]

const columns = [
  { prop: "name", label: "名称", align: "left", minWidth: 140 },
  { prop: "contact", label: "联系人", align: "center", width: 100 },
  { prop: "contactInfo", label: "联系方式", align: "center", minWidth: 120 },
  { prop: "uMobile", label: "用户手机", align: "center", minWidth: 120 },
  { prop: "vipAttribute", label: "会员属性", align: "center", slot: "vipAttribute", width: 90 },
  { prop: "auditResult", label: "审核状态", align: "center", slot: "auditResult", width: 90 },
  { prop: "cover", label: "封面", align: "center", slot: "cover", width: 90 },
  { prop: "updateTime", label: "更新时间", align: "center", minWidth: 160 },
  { label: "操作", width: 140, align: "center", fixed: "right", slot: "action" }
]

function handleSearch() {
  tableListRef.value?.search()
}

function handleReset() {
  handleSearch()
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除申请：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteJadeCommitteeApplyApi(row.id).then(() => {
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
        cache-key="jade-committee-apply-search"
        label-width="80px"
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>

    <template #toolbar>
      <el-button v-permission="PERM.jadeCommitteeApply.add" type="primary" :icon="CirclePlus" @click="handleAdd">
        新增申请
      </el-button>
    </template>

    <template #table>
      <TableList
        ref="tableListRef"
        :columns="columns"
        :api="getJadeCommitteeApplyListApi"
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
        <template #auditResult="{ row }">
          <OptionLabel :options="JADE_AUDIT_RESULT_OPTIONS" :value="row.auditResult" />
        </template>
        <template #action="{ row }">
          <el-button v-permission="PERM.jadeCommitteeApply.edit" type="primary" text bg size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="PERM.jadeCommitteeApply.delete" type="danger" text bg size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </TableList>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="tableListRef?.refresh()" />
</template>
