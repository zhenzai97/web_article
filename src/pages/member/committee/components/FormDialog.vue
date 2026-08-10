<script setup>
import { createCommitteeApi, updateCommitteeApi } from "@@/apis/committee"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

function initForm() {
  return {
    id: "",
    name: "",
    cover: "",
    intro: "",
    sort: 0,
    status: 1
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入专委会名称", trigger: "blur" }]
}

function show(data) {
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name,
      cover: data.cover ?? "",
      intro: data.intro ?? "",
      sort: data.sort ?? 0,
      status: data.status ?? 1
    })
    options.title = "编辑专委会"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增专委会"
  }
}

function close() {
  options.visible = false
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    options.loading = true
    const payload = {
      name: form.value.name,
      cover: form.value.cover || undefined,
      intro: form.value.intro || undefined,
      sort: form.value.sort,
      status: form.value.status
    }
    const api = isEdit.value
      ? updateCommitteeApi({ id: form.value.id, ...payload })
      : createCommitteeApi(payload)
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
    size="520px"
    destroy-on-close
    @closed="close"
  >
    <div v-loading="options.loading" class="drawer-body">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="left">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入专委会名称" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <ImageUpload v-model="form.cover" :width="160" :height="160" />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input
            v-model="form.intro"
            type="textarea"
            :rows="3"
            placeholder="可选，对应旧字段 desc"
          />
        </el-form-item>
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
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            controls-position="right"
            class="full-width"
          />
        </el-form-item>
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

.full-width {
  width: 100%;
}
</style>
