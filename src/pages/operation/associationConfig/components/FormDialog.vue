<script setup>
import {
  createAssociationConfigApi,
  getAssociationConfigDetailApi,
  updateAssociationConfigApi
} from "@@/apis/association-config"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const emit = defineEmits(["success"])

const CONTENT_TABS = [
  { name: "intro", label: "协会简介" },
  { name: "purpose", label: "协会宗旨" },
  { name: "business", label: "协会业务" },
  { name: "remark", label: "补充说明" }
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
    name: "",
    workTime: "",
    mobile: "",
    email: "",
    address: "",
    wxAccount: "",
    intro: "",
    purpose: "",
    business: "",
    remark: "",
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入协会名称", trigger: "blur" }]
}

async function show(data) {
  activeTab.value = "basic"
  options.visible = true
  options.loading = true
  try {
    if (data?.id) {
      const { data: detail } = await getAssociationConfigDetailApi(data.id)
      Object.assign(form.value, initForm(), {
        id: detail.id,
        name: detail.name ?? "",
        workTime: detail.workTime ?? "",
        mobile: detail.mobile ?? "",
        email: detail.email ?? "",
        address: detail.address ?? "",
        wxAccount: detail.wxAccount ?? "",
        intro: detail.intro ?? "",
        purpose: detail.purpose ?? "",
        business: detail.business ?? "",
        remark: detail.remark ?? "",
        status: detail.status ?? 1
      })
      options.title = "编辑协会配置"
    } else {
      Object.assign(form.value, initForm())
      options.title = "新增协会配置"
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
    name: form.value.name,
    workTime: form.value.workTime || undefined,
    mobile: form.value.mobile || undefined,
    email: form.value.email || undefined,
    address: form.value.address || undefined,
    wxAccount: form.value.wxAccount || undefined,
    intro: form.value.intro || undefined,
    purpose: form.value.purpose || undefined,
    business: form.value.business || undefined,
    remark: form.value.remark || undefined,
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
      ? updateAssociationConfigApi({ id: form.value.id, ...payload })
      : createAssociationConfigApi(payload)
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
              <el-form-item label="协会名称" prop="name">
                <el-input v-model="form.name" maxlength="128" placeholder="请输入协会名称" />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="工作时间" prop="workTime">
                    <el-input v-model="form.workTime" maxlength="64" placeholder="如 09:00-18:00" />
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
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" maxlength="128" placeholder="联系邮箱" />
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
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="form.address" maxlength="256" placeholder="联系地址" />
              </el-form-item>
              <el-form-item label="微信二维码" prop="wxAccount">
                <ImageUpload v-model="form.wxAccount" :width="140" :height="140" />
              </el-form-item>
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
