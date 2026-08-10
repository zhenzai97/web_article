<script setup>
import { createExpertApplyApi, updateExpertApplyApi } from "@@/apis/expert-apply"
import { EXPERT_PLATFORM_OPTIONS } from "@@/constants/expert"

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
    realName: "",
    mobile: "",
    fansNum: "",
    field: "",
    intro: "",
    plat: []
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入达人昵称", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
}

function show(data) {
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      realName: data.realName ?? "",
      mobile: data.mobile ?? "",
      fansNum: data.fansNum ?? "",
      field: data.field ?? "",
      intro: data.intro ?? "",
      plat: Array.isArray(data.plat) ? [...data.plat] : []
    })
    options.title = "编辑达人申请"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增达人申请"
  }
}

function close() {
  options.visible = false
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildPayload() {
  return {
    name: form.value.name,
    realName: form.value.realName || undefined,
    mobile: form.value.mobile,
    fansNum: form.value.fansNum || undefined,
    field: form.value.field || undefined,
    intro: form.value.intro || undefined,
    plat: form.value.plat?.length ? form.value.plat : undefined
  }
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    options.loading = true
    const payload = buildPayload()
    const api = isEdit.value
      ? updateExpertApplyApi({ id: form.value.id, ...payload })
      : createExpertApplyApi(payload)
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
  <el-dialog
    v-model="options.visible"
    :title="options.title"
    width="640px"
    destroy-on-close
    @closed="close"
  >
    <el-form
      ref="formRef"
      v-loading="options.loading"
      :model="form"
      :rules="rules"
      label-width="96px"
    >
      <el-form-item label="达人昵称" prop="name">
        <el-input v-model="form.name" maxlength="128" placeholder="请输入达人昵称/账号名" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="form.realName" maxlength="64" placeholder="真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" maxlength="32" placeholder="联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="粉丝数" prop="fansNum">
            <el-input v-model="form.fansNum" maxlength="64" placeholder="如 140000 / 9.1万" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="擅长领域" prop="field">
            <el-input v-model="form.field" maxlength="128" placeholder="擅长领域" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属平台" prop="plat">
        <el-select
          v-model="form.plat"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择所属平台"
          style="width: 100%"
        >
          <el-option
            v-for="item in EXPERT_PLATFORM_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介" prop="intro">
        <el-input
          v-model="form.intro"
          type="textarea"
          :rows="3"
          maxlength="500"
          show-word-limit
          placeholder="个人简介"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="options.loading" @click="confirm">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
