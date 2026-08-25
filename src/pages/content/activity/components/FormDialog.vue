<script setup>
import { createActivityApi, updateActivityApi } from "@@/apis/activity"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import RegistrationPanel from "./RegistrationPanel.vue"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "",
  loading: false,
  /** edit | registration */
  mode: "edit"
})

const activeTab = ref("basic")

function initForm() {
  return {
    id: "",
    title: "",
    cover: "",
    intro: "",
    content: "",
    address: "",
    bmStartTime: undefined,
    bmEndTime: undefined,
    startTime: undefined,
    endTime: undefined,
    sort: 0,
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)
const isRegistrationOnly = computed(() => options.mode === "registration")

const rules = {
  title: [{ required: true, message: "请输入活动标题", trigger: "blur" }]
}

function show(data, mode = "edit") {
  options.mode = mode
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      title: data.title,
      cover: data.cover ?? "",
      intro: data.intro ?? "",
      content: data.content ?? "",
      address: data.address ?? "",
      bmStartTime: data.bmStartTime || undefined,
      bmEndTime: data.bmEndTime || undefined,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
      sort: data.sort ?? 0,
      status: data.status ?? 1
    })
    if (mode === "registration") {
      activeTab.value = "registration"
      options.title = `报名记录 - ${data.title || ""}`
    } else {
      activeTab.value = "basic"
      options.title = "编辑活动"
    }
  } else {
    Object.assign(form.value, initForm())
    activeTab.value = "basic"
    options.title = "新增活动"
    options.mode = "edit"
  }
}

function close() {
  options.visible = false
  options.mode = "edit"
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function confirm() {
  if (isRegistrationOnly.value) {
    close()
    return
  }
  formRef.value?.validate((valid) => {
    if (!valid) {
      activeTab.value = "basic"
      ElMessage.error("表单校验不通过，请检查基础信息")
      return
    }
    options.loading = true
    const payload = {
      title: form.value.title,
      cover: form.value.cover || undefined,
      intro: form.value.intro || undefined,
      content: form.value.content || undefined,
      address: form.value.address || undefined,
      bmStartTime: form.value.bmStartTime || undefined,
      bmEndTime: form.value.bmEndTime || undefined,
      startTime: form.value.startTime || undefined,
      endTime: form.value.endTime || undefined,
      sort: form.value.sort,
      status: form.value.status
    }
    const api = isEdit.value
      ? updateActivityApi({ id: form.value.id, ...payload })
      : createActivityApi(payload)
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
      <!-- 仅查看报名 -->
      <div v-if="isRegistrationOnly" class="tab-pane-body">
        <RegistrationPanel :activity-id="form.id" :activity-title="form.title" />
      </div>

      <el-tabs v-else v-model="activeTab" class="form-tabs">
        <el-tab-pane label="基础信息" name="basic">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            label-position="left"
          >
            <div class="tab-pane-body">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入活动标题" />
              </el-form-item>
              <el-form-item label="封面" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="简介" prop="intro">
                <el-input
                  v-model="form.intro"
                  type="textarea"
                  :rows="3"
                  placeholder="活动简介"
                />
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" placeholder="活动地址（可选）" />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="报名开始" prop="bmStartTime">
                    <el-date-picker
                      v-model="form.bmStartTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      class="full-width"
                      placeholder="报名开始时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报名结束" prop="bmEndTime">
                    <el-date-picker
                      v-model="form.bmEndTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      class="full-width"
                      placeholder="报名结束时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="活动开始" prop="startTime">
                    <el-date-picker
                      v-model="form.startTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      class="full-width"
                      placeholder="活动开始时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束" prop="endTime">
                    <el-date-picker
                      v-model="form.endTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      class="full-width"
                      placeholder="活动结束时间"
                    />
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
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="详情内容" name="content">
          <el-form :model="form" label-width="100px">
            <div class="tab-pane-body tab-pane-body--content">
              <el-form-item label="正文" prop="content" label-position="top" class="content-item">
                <RichEditor v-model="form.content" height="calc(100vh - 280px)" />
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane v-if="form.id" label="报名记录" name="registration">
          <div class="tab-pane-body">
            <RegistrationPanel :activity-id="form.id" :activity-title="form.title" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <el-button @click="close">
        {{ isRegistrationOnly ? '关闭' : '取消' }}
      </el-button>
      <el-button v-if="!isRegistrationOnly" type="primary" :loading="options.loading" @click="confirm">
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
