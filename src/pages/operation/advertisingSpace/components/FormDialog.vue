<script setup>
import {
  createAdvertisingSpaceApi,
  updateAdvertisingSpaceApi
} from "@@/apis/advertising-space"

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
    status: 1,
    remark: ""
  }
}

const loading = ref(false)
const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  sign: [{ required: true, message: "请输入运营位标识", trigger: "blur" }],
  name: [{ required: true, message: "请输入运营位名称", trigger: "blur" }]
}

function show(data) {
  options.visible = true
  if (data) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      sign: data.sign,
      name: data.name,
      status: data.status ?? 1,
      remark: data.remark ?? ""
    })
    options.title = "修改运营位"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增运营位"
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
      status: form.value.status,
      remark: form.value.remark || undefined
    }
    const api = isEdit.value
      ? updateAdvertisingSpaceApi({ id: form.value.id, ...payload })
      : createAdvertisingSpaceApi(payload)
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
      <el-form-item label="运营位标识" prop="sign">
        <el-input v-model="form.sign" placeholder="如 home_banner" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="运营位名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入运营位名称" />
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
