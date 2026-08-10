<script setup>
import {
  createMemberConfigApi,
  getMemberConfigDetailApi,
  updateMemberConfigApi
} from "@@/apis/member-config"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const emit = defineEmits(["success"])

const CONTENT_TABS = [
  { name: "conditionContent", label: "入会条件" },
  { name: "treaty", label: "自律公约" },
  { name: "equity", label: "会员权益" },
  { name: "notice", label: "协会章程" },
  { name: "agreement", label: "入会协议" }
]

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

const activeTab = ref("conditionContent")

function initForm() {
  return {
    id: "",
    conditionContent: "",
    treaty: "",
    equity: "",
    notice: "",
    agreement: "",
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

async function show(data) {
  activeTab.value = "conditionContent"
  options.visible = true
  options.loading = true
  try {
    if (data?.id) {
      const { data: detail } = await getMemberConfigDetailApi(data.id)
      Object.assign(form.value, initForm(), {
        id: detail.id,
        conditionContent: detail.conditionContent ?? "",
        treaty: detail.treaty ?? "",
        equity: detail.equity ?? "",
        notice: detail.notice ?? "",
        agreement: detail.agreement ?? "",
        status: detail.status ?? 1
      })
      options.title = "编辑会员配置"
    } else {
      Object.assign(form.value, initForm())
      options.title = "新增会员配置"
    }
  } finally {
    options.loading = false
  }
}

function close() {
  options.visible = false
  activeTab.value = "conditionContent"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildPayload() {
  return {
    conditionContent: form.value.conditionContent || undefined,
    treaty: form.value.treaty || undefined,
    equity: form.value.equity || undefined,
    notice: form.value.notice || undefined,
    agreement: form.value.agreement || undefined,
    status: form.value.status
  }
}

function hasAnyContent(payload) {
  return CONTENT_TABS.some(tab => !!payload[tab.name])
}

function confirm() {
  const payload = buildPayload()
  if (!isEdit.value && !hasAnyContent(payload)) {
    ElMessage.error("配置内容不能全部为空")
    return
  }
  options.loading = true
  const api = isEdit.value
    ? updateMemberConfigApi({ id: form.value.id, ...payload })
    : createMemberConfigApi(payload)
  api.then(() => {
    ElMessage.success("操作成功")
    emit("success")
    close()
  }).finally(() => {
    options.loading = false
  })
}

defineExpose({ show })
</script>

<template>
  <el-drawer
    v-model="options.visible"
    :title="options.title"
    size="70vw"
    destroy-on-close
    @closed="close"
  >
    <div v-loading="options.loading" class="drawer-body">
      <el-form ref="formRef" :model="form" label-width="80px" label-position="left">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in ENABLE_STATUS_OPTIONS"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-tabs v-model="activeTab" class="form-tabs">
          <el-tab-pane
            v-for="tab in CONTENT_TABS"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          >
            <div class="tab-pane-body">
              <RichEditor v-model="form[tab.name]" height="calc(100vh - 300px)" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="options.loading" @click="confirm">
        保存
      </el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-body {
  padding-right: 4px;
}

.form-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    font-weight: 500;
  }
}

.tab-pane-body {
  min-height: calc(100vh - 320px);
}
</style>
