<script setup>
import {
  deleteActivityRegistrationApi,
  getActivityRegistrationListApi
} from "@@/apis/activity-registration"
import TableList from "@@/components/TableList/index.vue"
import { PERM } from "@@/constants/permission"

const props = defineProps({
  activityId: {
    type: [Number, String],
    required: true
  },
  activityTitle: {
    type: String,
    default: ""
  }
})

const tableListRef = useTemplateRef("tableListRef")

const params = computed(() => ({
  activityId: props.activityId
}))

const columns = [
  { prop: "name", label: "报名人", align: "left", minWidth: 100 },
  { prop: "mobile", label: "联系电话", align: "center", minWidth: 120 },
  { prop: "num", label: "人数", align: "center", width: 70 },
  { prop: "userName", label: "用户昵称", align: "left", minWidth: 100 },
  { prop: "userMobile", label: "用户手机", align: "center", minWidth: 120 },
  { prop: "createTime", label: "报名时间", align: "center", minWidth: 160 },
  { label: "操作", width: 90, align: "center", fixed: "right", slot: "action" }
]

watch(
  () => props.activityId,
  () => {
    nextTick(() => tableListRef.value?.search())
  }
)

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除报名：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteActivityRegistrationApi(row.id).then(() => {
      ElMessage.success("删除成功")
      tableListRef.value?.refresh()
    })
  })
}
</script>

<template>
  <div class="registration-panel">
    <p v-if="activityTitle" class="hint">
      当前活动：{{ activityTitle }}
    </p>
    <TableList
      ref="tableListRef"
      :columns="columns"
      :api="getActivityRegistrationListApi"
      :params="params"
      :page-size="10"
    >
      <template #action="{ row }">
        <el-button
          v-permission="PERM.contentActivityRegistration.delete"
          type="danger"
          text
          bg
          size="small"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </TableList>
  </div>
</template>

<style lang="scss" scoped>
.registration-panel {
  min-height: 320px;
}

.hint {
  margin: 0 0 12px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
