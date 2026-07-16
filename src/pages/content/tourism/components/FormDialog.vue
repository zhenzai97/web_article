<script setup>
import { createTourismContentApi, updateTourismContentApi } from "@@/apis/tourism-content"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS, YES_NO_OPTIONS } from "@@/constants/article"
import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"

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
    type: "product",
    name: "",
    cover: "",
    intro: "",
    content: "",
    sort: 0,
    status: 1,
    isRecommend: 0,
    readCount: 0,
    albumUrl: "",
    address: "",
    coordinate: "",
    mobile: "",
    openTime: "",
    ticketPrice: ""
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const showRecommend = computed(() => ["brand", "market"].includes(form.value.type))
const showAlbum = computed(() => ["food", "scenic"].includes(form.value.type))
const showScenic = computed(() => form.value.type === "scenic")

const rules = {
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

function show(data) {
  activeTab.value = "basic"
  options.visible = true
  if (data?.id) {
    const album = Array.isArray(data.album) ? data.album : []
    Object.assign(form.value, initForm(), {
      id: data.id,
      type: data.type || "product",
      name: data.name,
      cover: data.cover ?? "",
      intro: data.intro ?? "",
      content: data.content ?? "",
      sort: data.sort ?? 0,
      status: data.status ?? 1,
      isRecommend: data.isRecommend ?? 0,
      readCount: data.readCount ?? 0,
      albumUrl: album[0] ?? "",
      address: data.address ?? "",
      coordinate: data.coordinate ?? "",
      mobile: data.mobile ?? "",
      openTime: data.openTime ?? "",
      ticketPrice: data.ticketPrice ?? ""
    })
    options.title = "编辑文旅内容"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增文旅内容"
  }
}

function close() {
  options.visible = false
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildPayload() {
  const album = form.value.albumUrl ? [form.value.albumUrl] : undefined
  return {
    type: form.value.type,
    name: form.value.name,
    cover: form.value.cover || undefined,
    intro: form.value.intro || undefined,
    content: form.value.content || undefined,
    sort: form.value.sort,
    status: form.value.status,
    isRecommend: showRecommend.value ? form.value.isRecommend : 0,
    readCount: form.value.readCount,
    album: showAlbum.value ? album : undefined,
    address: showScenic.value ? (form.value.address || undefined) : undefined,
    coordinate: showScenic.value ? (form.value.coordinate || undefined) : undefined,
    mobile: showScenic.value ? (form.value.mobile || undefined) : undefined,
    openTime: showScenic.value ? (form.value.openTime || undefined) : undefined,
    ticketPrice: showScenic.value ? (form.value.ticketPrice || undefined) : undefined
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
      ? updateTourismContentApi({ id: form.value.id, ...payload })
      : createTourismContentApi(payload)
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
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型" class="full-width" :disabled="isEdit">
                  <el-option
                    v-for="item in TOURISM_TYPE_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="封面图" prop="cover">
                <ImageUpload v-model="form.cover" :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="简介" prop="intro">
                <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="简介" />
              </el-form-item>
              <el-form-item v-if="showAlbum" label="相册图" prop="albumUrl">
                <ImageUpload v-model="form.albumUrl" :width="160" :height="160" />
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
                <el-col v-if="showRecommend" :span="12">
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
                <el-col :span="12">
                  <el-form-item label="阅读量" prop="readCount">
                    <el-input-number v-model="form.readCount" :min="0" controls-position="right" class="full-width" />
                  </el-form-item>
                </el-col>
              </el-row>

              <template v-if="showScenic">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" placeholder="景点地址" />
                </el-form-item>
                <el-form-item label="坐标" prop="coordinate">
                  <el-input v-model="form.coordinate" placeholder="如 24.423257,98.596082" />
                </el-form-item>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="电话" prop="mobile">
                      <el-input v-model="form.mobile" placeholder="联系电话" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="门票" prop="ticketPrice">
                      <el-input v-model="form.ticketPrice" placeholder="门票价格" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="开放时间" prop="openTime">
                  <el-input v-model="form.openTime" placeholder="如 全年 08:30-18:30" />
                </el-form-item>
              </template>
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
