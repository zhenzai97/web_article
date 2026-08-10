<script setup>
import { createExpertApi, updateExpertApi } from "@@/apis/expert"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { EXPERT_PLATFORM_OPTIONS } from "@@/constants/expert"

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
    video: "",
    intro: "",
    content: "",
    plat: [],
    isJade: 0,
    isRecommend: 0,
    sort: 0,
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入达人名称", trigger: "blur" }]
}

function show(data) {
  activeTab.value = "basic"
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      cover: data.cover ?? "",
      video: data.video ?? "",
      intro: data.intro ?? "",
      content: data.content ?? "",
      plat: Array.isArray(data.plat) ? [...data.plat] : [],
      isJade: data.isJade ?? 0,
      isRecommend: data.isRecommend ?? 0,
      sort: data.sort ?? 0,
      status: data.status ?? 1
    })
    options.title = "编辑达人"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增达人"
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
    cover: form.value.cover || undefined,
    video: form.value.video || undefined,
    intro: form.value.intro || undefined,
    content: form.value.content || undefined,
    plat: form.value.plat?.length ? form.value.plat : undefined,
    isJade: form.value.isJade,
    isRecommend: form.value.isRecommend,
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
      ? updateExpertApi({ id: form.value.id, ...payload })
      : createExpertApi(payload)
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
              <el-form-item label="达人名称" prop="name">
                <el-input v-model="form.name" maxlength="128" placeholder="请输入达人名称" />
              </el-form-item>
              <el-form-item label="封面图" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="介绍视频" prop="video">
                <el-input v-model="form.video" placeholder="可选，视频 URL" />
              </el-form-item>
              <el-form-item label="简介" prop="intro">
                <el-input
                  v-model="form.intro"
                  type="textarea"
                  :rows="3"
                  maxlength="500"
                  show-word-limit
                  placeholder="请输入简介"
                />
              </el-form-item>
              <el-form-item label="所属平台" prop="plat">
                <el-select
                  v-model="form.plat"
                  multiple
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择所属平台"
                  class="full-width"
                >
                  <el-option
                    v-for="item in EXPERT_PLATFORM_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="玉石达人" prop="isJade">
                    <el-select v-model="form.isJade" class="full-width">
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
                  <el-form-item label="是否推荐" prop="isRecommend">
                    <el-select v-model="form.isRecommend" class="full-width">
                      <el-option
                        v-for="item in YES_NO_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
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
