<script setup>
import {
  createJadeCommitteeConfigApi,
  getJadeCommitteeConfigDetailApi,
  updateJadeCommitteeConfigApi
} from "@@/apis/jade-committee-config"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"

const emit = defineEmits(["success"])

const CONTENT_TABS = [
  { name: "description", label: "简介" },
  { name: "mission", label: "使命" },
  { name: "business", label: "业务" },
  { name: "needKnow", label: "须知" },
  { name: "privacyPolicy", label: "隐私政策" }
]

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

const activeTab = ref("basic")

function initForm() {
  return {
    id: "",
    contact: "",
    mobile: "",
    isJump: 0,
    description: "",
    mission: "",
    business: "",
    needKnow: "",
    privacyPolicy: "",
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  contact: [{ required: true, message: "请输入联系人", trigger: "blur" }]
}

async function show(data) {
  activeTab.value = "basic"
  options.visible = true
  options.loading = true
  try {
    if (data?.id) {
      const { data: detail } = await getJadeCommitteeConfigDetailApi(data.id)
      Object.assign(form.value, initForm(), {
        id: detail.id,
        contact: detail.contact ?? "",
        mobile: detail.mobile ?? "",
        isJump: detail.isJump ?? 0,
        description: detail.description ?? "",
        mission: detail.mission ?? "",
        business: detail.business ?? "",
        needKnow: detail.needKnow ?? "",
        privacyPolicy: detail.privacyPolicy ?? "",
        status: detail.status ?? 1
      })
      options.title = "编辑非洲翠专委会配置"
    } else {
      Object.assign(form.value, initForm())
      options.title = "新增非洲翠专委会配置"
    }
  } finally {
    options.loading = false
  }
}

function close() {
  options.visible = false
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildPayload() {
  return {
    contact: form.value.contact,
    mobile: form.value.mobile || undefined,
    isJump: form.value.isJump,
    description: form.value.description || undefined,
    mission: form.value.mission || undefined,
    business: form.value.business || undefined,
    needKnow: form.value.needKnow || undefined,
    privacyPolicy: form.value.privacyPolicy || undefined,
    status: form.value.status
  }
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      activeTab.value = "basic"
      ElMessage.error("表单校验不通过，请检查基础信息")
      return
    }
    options.loading = true
    const payload = buildPayload()
    const api = isEdit.value
      ? updateJadeCommitteeConfigApi({ id: form.value.id, ...payload })
      : createJadeCommitteeConfigApi(payload)
    api.then(() => {
      ElMessage.success("操作成功")
      emit("success")
      close()
    }).finally(() => {
      options.loading = false
    })
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-tabs v-model="activeTab" class="form-tabs">
          <el-tab-pane label="基础信息" name="basic">
            <div class="tab-pane-body">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="联系人" prop="contact">
                    <el-input v-model="form.contact" maxlength="64" placeholder="联系人" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="form.mobile" maxlength="32" placeholder="联系电话" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="是否跳转" prop="isJump">
                    <el-select v-model="form.isJump" class="full-width">
                      <el-option
                        v-for="item in YES_NO_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" class="full-width">
                      <el-option
                        v-for="item in ENABLE_STATUS_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>

          <el-tab-pane
            v-for="tab in CONTENT_TABS"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          >
            <div class="tab-pane-body tab-pane-body--content">
              <RichEditor v-model="form[tab.name]" height="calc(100vh - 280px)" />
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
  padding: 0 4px 8px;

  &--content {
    min-height: calc(100vh - 320px);
  }
}

.full-width {
  width: 100%;
}
</style>
