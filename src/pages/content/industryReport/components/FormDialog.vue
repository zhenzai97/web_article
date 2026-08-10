<script setup>
import { createIndustryReportApi, updateIndustryReportApi } from "@@/apis/industry-report"
import FileUpload from "@@/components/FileUpload/index.vue"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const emit = defineEmits(["success"])

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
    cover: "",
    intro: "",
    content: "",
    file: "",
    sort: 0,
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入报告名称", trigger: "blur" }]
}

function show(data) {
  activeTab.value = "basic"
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name,
      cover: data.cover ?? "",
      intro: data.intro ?? "",
      content: data.content ?? "",
      file: data.file ?? "",
      sort: data.sort ?? 0,
      status: data.status ?? 1
    })
    options.title = "编辑行业报告"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增行业报告"
  }
}

function close() {
  options.visible = false
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      activeTab.value = "basic"
      ElMessage.error("表单校验不通过，请检查基础信息")
      return
    }
    options.loading = true
    const payload = {
      name: form.value.name,
      cover: form.value.cover || undefined,
      intro: form.value.intro || undefined,
      content: form.value.content || undefined,
      file: form.value.file || undefined,
      sort: form.value.sort,
      status: form.value.status
    }
    const api = isEdit.value
      ? updateIndustryReportApi({ id: form.value.id, ...payload })
      : createIndustryReportApi(payload)
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="left">
        <el-tabs v-model="activeTab" class="form-tabs">
          <el-tab-pane label="基础信息" name="basic">
            <div class="tab-pane-body">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入报告名称" />
              </el-form-item>
              <el-form-item label="封面" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="附件" prop="file">
                <FileUpload
                  v-model="form.file"
                  :limit="1"
                  tip="支持 PDF / Office / 压缩包等，单个不超过 50MB"
                />
              </el-form-item>
              <el-form-item label="简介" prop="intro">
                <el-input
                  v-model="form.intro"
                  type="textarea"
                  :rows="4"
                  placeholder="可选，对应旧字段 desc"
                />
              </el-form-item>
              <el-row :gutter="16">
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
                <el-col :span="12">
                  <el-form-item label="排序" prop="sort">
                    <el-input-number
                      v-model="form.sort"
                      :min="0"
                      controls-position="right"
                      class="full-width"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>

          <el-tab-pane label="详情内容" name="content">
            <div class="tab-pane-body tab-pane-body--content">
              <el-form-item label="正文" prop="content" label-position="top" class="content-item">
                <RichEditor v-model="form.content" height="calc(100vh - 280px)" />
              </el-form-item>
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
    margin-bottom: 20px;
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

.content-item {
  margin-bottom: 0;
  height: 100%;

  :deep(.el-form-item__label) {
    padding-bottom: 8px;
    font-weight: 600;
    line-height: 1.4;
  }

  :deep(.el-form-item__content) {
    line-height: normal;
  }
}

.full-width {
  width: 100%;
}
</style>
