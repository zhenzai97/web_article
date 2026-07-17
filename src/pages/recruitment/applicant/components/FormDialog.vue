<script setup>
import { createApplicantApi, updateApplicantApi } from "@@/apis/applicant"
import { getCompanyListApi } from "@@/apis/company"
import { getRecruitmentListApi } from "@@/apis/recruitment"
import { SALARY_RANGE_OPTIONS } from "@@/constants/recruitment"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

const companyOptions = ref([])
const companyLoading = ref(false)
const recruitmentOptions = ref([])
const recruitmentLoading = ref(false)

function initForm() {
  return {
    id: "",
    name: "",
    mobile: "",
    salaryRange: "",
    companyId: undefined,
    recruitmentId: undefined
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入应聘人姓名", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  recruitmentId: [{ required: true, message: "请选择应聘岗位", trigger: "change" }]
}

async function loadCompanies(keyword = "") {
  companyLoading.value = true
  try {
    const { data } = await getCompanyListApi({
      current: 1,
      pageSize: 50,
      name: keyword || undefined,
      status: 1,
      examineStatus: 1
    })
    companyOptions.value = data?.records || []
  } catch {
    companyOptions.value = []
  } finally {
    companyLoading.value = false
  }
}

async function loadRecruitments(keyword = "") {
  recruitmentLoading.value = true
  try {
    const { data } = await getRecruitmentListApi({
      current: 1,
      pageSize: 50,
      name: keyword || undefined,
      companyId: form.value.companyId || undefined,
      status: 1
    })
    recruitmentOptions.value = data?.records || []
  } catch {
    recruitmentOptions.value = []
  } finally {
    recruitmentLoading.value = false
  }
}

function ensureOption(listRef, id, name) {
  if (!id) return
  if (!listRef.value.some(item => item.id === id)) {
    listRef.value.unshift({ id, name: name || String(id) })
  }
}

async function show(data) {
  options.visible = true
  await Promise.all([loadCompanies(), loadRecruitments()])
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      mobile: data.mobile ?? "",
      salaryRange: data.salaryRange ?? "",
      companyId: data.companyId,
      recruitmentId: data.recruitmentId
    })
    ensureOption(companyOptions, data.companyId, data.companyName)
    ensureOption(recruitmentOptions, data.recruitmentId, data.recruitmentName)
    options.title = "编辑应聘"
  } else {
    Object.assign(form.value, initForm(), {
      companyId: data?.companyId,
      recruitmentId: data?.recruitmentId
    })
    if (data?.companyId) {
      ensureOption(companyOptions, data.companyId, data.companyName)
    }
    if (data?.recruitmentId) {
      ensureOption(recruitmentOptions, data.recruitmentId, data.recruitmentName)
    }
    options.title = "新增应聘"
  }
}

function close() {
  options.visible = false
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function onCompanyChange() {
  form.value.recruitmentId = undefined
  loadRecruitments()
}

function onRecruitmentChange(id) {
  const item = recruitmentOptions.value.find(row => row.id === id)
  if (!item) return
  if (item.companyId && form.value.companyId !== item.companyId) {
    form.value.companyId = item.companyId
    ensureOption(companyOptions, item.companyId, item.companyName)
  }
}

function buildPayload() {
  return {
    name: form.value.name,
    mobile: form.value.mobile,
    salaryRange: form.value.salaryRange || undefined,
    companyId: form.value.companyId || undefined,
    recruitmentId: form.value.recruitmentId || undefined
  }
}

async function submit() {
  await formRef.value?.validate()
  options.loading = true
  try {
    const payload = buildPayload()
    if (isEdit.value) {
      await updateApplicantApi({ id: form.value.id, ...payload })
      ElMessage.success("更新成功")
    } else {
      await createApplicantApi(payload)
      ElMessage.success("新增成功")
    }
    close()
    emit("success")
  } finally {
    options.loading = false
  }
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="options.visible"
    :title="options.title"
    width="560px"
    destroy-on-close
    @closed="close"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="96px"
      @submit.prevent
    >
      <el-form-item label="应聘人" prop="name">
        <el-input v-model="form.name" maxlength="64" placeholder="请输入应聘人姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="form.mobile" maxlength="32" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="期望薪资" prop="salaryRange">
        <el-select
          v-model="form.salaryRange"
          filterable
          allow-create
          clearable
          placeholder="请选择或输入期望薪资"
          style="width: 100%"
        >
          <el-option
            v-for="item in SALARY_RANGE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" prop="companyId">
        <el-select
          v-model="form.companyId"
          filterable
          remote
          clearable
          :remote-method="loadCompanies"
          :loading="companyLoading"
          placeholder="请选择公司（可选）"
          style="width: 100%"
          @change="onCompanyChange"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应聘岗位" prop="recruitmentId">
        <el-select
          v-model="form.recruitmentId"
          filterable
          remote
          :remote-method="loadRecruitments"
          :loading="recruitmentLoading"
          placeholder="请选择应聘岗位"
          style="width: 100%"
          @change="onRecruitmentChange"
        >
          <el-option
            v-for="item in recruitmentOptions"
            :key="item.id"
            :label="item.companyName ? `${item.name}（${item.companyName}）` : item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="options.loading" @click="submit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
