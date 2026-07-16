<script setup>
import { createAdvertisingApi, updateAdvertisingApi } from "@@/apis/advertising"
import { getAdvertisingSpaceAllApi } from "@@/apis/advertising-space"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const props = defineProps({
  spaces: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

const activeTab = ref("basic")
const spaceOptions = ref([])

function initForm() {
  return {
    id: "",
    spaceId: "",
    name: "",
    cover: "",
    video: "",
    path: "",
    content: "",
    remark: "",
    sort: 0,
    status: 1,
    startTime: "",
    endTime: ""
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
  spaceId: [{ required: true, message: "请选择运营位", trigger: "change" }]
}

async function loadSpaces() {
  if (props.spaces?.length) {
    spaceOptions.value = props.spaces
    return
  }
  try {
    const { data } = await getAdvertisingSpaceAllApi()
    spaceOptions.value = data
  } catch {
    spaceOptions.value = []
  }
}

function formatDate(value) {
  if (!value) return ""
  if (typeof value === "string") {
    return value.slice(0, 10)
  }
  return value
}

async function show(data) {
  activeTab.value = "basic"
  options.visible = true
  await loadSpaces()
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      spaceId: data.spaceId,
      name: data.name,
      cover: data.cover ?? "",
      video: data.video ?? "",
      path: data.path ?? "",
      content: data.content ?? "",
      remark: data.remark ?? "",
      sort: data.sort ?? 0,
      status: data.status ?? 1,
      startTime: formatDate(data.startTime),
      endTime: formatDate(data.endTime)
    })
    options.title = "编辑广告"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增广告"
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
      spaceId: form.value.spaceId,
      name: form.value.name,
      cover: form.value.cover || undefined,
      video: form.value.video || undefined,
      path: form.value.path || undefined,
      content: form.value.content || undefined,
      remark: form.value.remark || undefined,
      sort: form.value.sort,
      status: form.value.status,
      startTime: form.value.startTime || undefined,
      endTime: form.value.endTime || undefined
    }
    const api = isEdit.value
      ? updateAdvertisingApi({ id: form.value.id, ...payload })
      : createAdvertisingApi(payload)
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
              <el-form-item label="广告标题" prop="name">
                <el-input v-model="form.name" placeholder="请输入广告标题" />
              </el-form-item>
              <el-form-item label="运营位" prop="spaceId">
                <el-select v-model="form.spaceId" placeholder="请选择运营位" class="full-width">
                  <el-option
                    v-for="item in spaceOptions"
                    :key="item.id"
                    :label="`${item.name} (${item.sign})`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="封面图" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="视频地址" prop="video">
                <el-input v-model="form.video" placeholder="可选，视频 URL" />
              </el-form-item>
              <el-form-item label="跳转路径" prop="path">
                <el-input v-model="form.path" placeholder="如 /pages/newDetails/newDetails?id=xxx" />
              </el-form-item>
              <el-form-item label="简介" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选，对应旧字段 desc" />
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
                    <el-input-number v-model="form.sort" :min="0" controls-position="right" class="full-width" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="开始日期" prop="startTime">
                    <el-date-picker
                      v-model="form.startTime"
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="开始展示日期"
                      class="full-width"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束日期" prop="endTime">
                    <el-date-picker
                      v-model="form.endTime"
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="结束展示日期"
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
