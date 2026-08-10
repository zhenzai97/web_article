<script setup>
import { createJadeResourceApi, updateJadeResourceApi } from "@@/apis/jade-resource"
import FileUpload from "@@/components/FileUpload/index.vue"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import { JADE_RESOURCE_TYPE_OPTIONS } from "@@/constants/jade"

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
    type: undefined,
    file: [],
    content: "",
    sort: 0,
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择资源类型", trigger: "change" }]
}

function normalizeFileList(file) {
  if (!file) return []
  if (Array.isArray(file)) return file.filter(Boolean)
  return [file].filter(Boolean)
}

function show(data) {
  activeTab.value = "basic"
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      cover: data.cover ?? "",
      type: data.type,
      file: normalizeFileList(data.file),
      content: data.content ?? "",
      sort: data.sort ?? 0,
      status: data.status ?? 1
    })
    options.title = "编辑非洲翠资源"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增非洲翠资源"
  }
}

function close() {
  options.visible = false
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildPayload() {
  const files = normalizeFileList(form.value.file)
  return {
    name: form.value.name,
    cover: form.value.cover || undefined,
    type: form.value.type,
    file: files.length ? files : undefined,
    content: form.value.content || undefined,
    sort: form.value.sort,
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
      ? updateJadeResourceApi({ id: form.value.id, ...payload })
      : createJadeResourceApi(payload)
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
                <el-input v-model="form.name" placeholder="请输入资源名称" />
              </el-form-item>
              <el-form-item label="封面" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择资源类型" class="full-width">
                  <el-option
                    v-for="item in JADE_RESOURCE_TYPE_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文件" prop="file">
                <FileUpload
                  v-model="form.file"
                  :limit="20"
                  tip="可上传多个附件（PDF / 图片等），单个不超过 50MB"
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
