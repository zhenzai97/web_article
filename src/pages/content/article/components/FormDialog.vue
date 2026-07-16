<script setup>
import { getArticleCatAllApi } from "@@/apis/article-cats"
import { createArticleApi, updateArticleApi } from "@@/apis/articles"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ArticleStatusEnum, ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const props = defineProps({
  categories: {
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
const categoryOptions = ref([])

function initForm() {
  return {
    id: "",
    title: "",
    categoryId: "",
    cover: "",
    summary: "",
    content: "",
    author: "",
    status: ArticleStatusEnum.Draft,
    isTop: 0,
    readNum: 0,
    isHome: 0,
    sort: 0,
    tags: [],
    publishTime: ""
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择栏目", trigger: "change" }],
  content: [{ required: true, message: "请输入正文", trigger: "blur" }]
}

function isContentEmpty(content) {
  return !content || content === "<p><br></p>"
}

async function loadCategories() {
  if (props.categories?.length) {
    categoryOptions.value = props.categories
    return
  }
  try {
    const { data } = await getArticleCatAllApi()
    categoryOptions.value = data
  } catch {
    categoryOptions.value = []
  }
}

async function show(data) {
  activeTab.value = "basic"
  options.visible = true

  await loadCategories()
  if (data?.id) {
    const detail = data
    Object.assign(form.value, initForm(), {
      id: detail.id,
      title: detail.title,
      categoryId: detail.categoryId,
      cover: detail.cover ?? "",
      summary: detail.summary ?? "",
      content: detail.content ?? "",
      author: detail.author ?? "",
      status: detail.status ?? ArticleStatusEnum.Draft,
      isTop: detail.isTop ?? 0,
      isHome: detail.isHome ?? 0,
      readNum: detail.readNum ?? 0,
      sort: detail.sort ?? 0,
      tags: detail.tags ?? [],
      publishTime: detail.publishTime ?? ""
    })
    options.title = "编辑文章"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增文章"
  }
}

function close() {
  options.visible = false
  activeTab.value = "basic"
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function confirm() {
  formRef.value?.validate((valid, fields) => {
    if (!valid) {
      const basicFields = ["title", "categoryId"]
      const hasBasicError = fields && basicFields.some(key => key in fields)
      activeTab.value = hasBasicError ? "basic" : "content"
      ElMessage.error("表单校验不通过，请检查当前页签")
      return
    }
    if (isContentEmpty(form.value.content)) {
      activeTab.value = "content"
      ElMessage.error("请在「文章具体内容」中填写正文")
      return
    }
    options.loading = true
    const payload = {
      title: form.value.title,
      categoryId: form.value.categoryId,
      cover: form.value.cover || undefined,
      summary: form.value.summary || undefined,
      content: form.value.content,
      author: form.value.author || undefined,
      status: form.value.status,
      isTop: form.value.isTop,
      isHome: form.value.isHome,
      readNum: form.value.readNum,
      sort: form.value.sort,
      tags: form.value.tags.length ? form.value.tags : undefined,
      publishTime: form.value.publishTime || undefined
    }
    const api = isEdit.value
      ? updateArticleApi({ id: form.value.id, ...payload })
      : createArticleApi(payload)
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
          <el-tab-pane label="文章基础信息" name="basic">
            <div class="tab-pane-body">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
              </el-form-item>
              <el-form-item label="栏目" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择栏目" class="full-width">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="`${item.name} (${item.sign})`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="封面图" prop="cover">
                <ImageUpload v-model="form.cover" disabled :width="160" :height="160" />
              </el-form-item>
              <el-form-item label="摘要" prop="summary">
                <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="可选，用于列表与分享展示" />
              </el-form-item>
              <!-- <el-form-item label="作者" prop="author">
                <el-input v-model="form.author" placeholder="可选" />
              </el-form-item> -->
              <el-form-item label="阅读量" prop="readNum">
                <el-input-number v-model="form.readNum" :min="0" controls-position="right" class="full-width" />
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
                  <el-form-item label="置顶" prop="isTop">
                    <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="首页推荐" prop="isHome">
                    <el-switch v-model="form.isHome" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="标签" prop="tags">
                <el-select
                  v-model="form.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="输入后回车添加标签"
                  class="full-width"
                />
              </el-form-item>
              <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker
                  v-model="form.publishTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="可选，留空则使用保存时间"
                  class="full-width"
                />
              </el-form-item>
            </div>
          </el-tab-pane>

          <el-tab-pane label="文章具体内容" name="content">
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
