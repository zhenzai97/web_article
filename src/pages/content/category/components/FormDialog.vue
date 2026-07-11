<script setup>
import { createArticleCatApi, updateArticleCatApi } from "@@/apis/article-cats"
import { PRESET_CATEGORY_SIGNS } from "@@/constants/article"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: ""
})

function initForm() {
  return {
    id: "",
    sign: "",
    name: "",
    sort: 0,
    status: 1,
    remark: ""
  }
}

const loading = ref(false)
const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  sign: [{ required: true, message: "请输入分类标识", trigger: "blur" }],
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
}

function applyPreset(sign) {
  const preset = PRESET_CATEGORY_SIGNS.find(item => item.sign === sign)
  if (preset) {
    form.value.sign = preset.sign
    form.value.name = preset.name
  }
}

function show(data) {
  options.visible = true
  if (data) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      sign: data.sign,
      name: data.name,
      sort: data.sort ?? 0,
      status: data.status ?? 1,
      remark: data.remark ?? ""
    })
    options.title = "修改分类"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增分类"
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
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    const payload = {
      sign: form.value.sign,
      name: form.value.name,
      sort: form.value.sort,
      status: form.value.status,
      remark: form.value.remark
    }
    const api = isEdit.value
      ? updateArticleCatApi({ id: form.value.id, ...payload })
      : createArticleCatApi(payload)
    api.then(() => {
      ElMessage.success("操作成功")
      emit("success")
      close()
    }).finally(() => {
      loading.value = false
    })
  })
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="options.visible"
    :title="options.title"
    width="520px"
    @closed="close"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item v-if="!isEdit" label="快速填充">
        <div class="preset-tags">
          <el-tag
            v-for="item in PRESET_CATEGORY_SIGNS"
            :key="item.sign"
            class="preset-tag"
            effect="plain"
            @click="applyPreset(item.sign)"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="分类标识" prop="sign">
        <el-input v-model="form.sign" placeholder="如 xhdt、wxyw" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" controls-position="right" class="full-width" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">
            启用
          </el-radio>
          <el-radio :value="0">
            停用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="confirm">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}

.preset-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-tag {
  cursor: pointer;
}
</style>
