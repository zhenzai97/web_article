<script setup>
import { getCompanyListApi } from "@@/apis/company"
import { createRecruitmentApi, updateRecruitmentApi } from "@@/apis/recruitment"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import {
  QUALIFICATION_OPTIONS,
  SALARY_RANGE_OPTIONS,
  WORKING_HOURS_OPTIONS
} from "@@/constants/recruitment"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "",
  loading: false
})

const activeTab = ref("basic")
const companyOptions = ref([])
const companyLoading = ref(false)

function initForm() {
  return {
    id: "",
    name: "",
    salaryRange: "",
    workingHours: "",
    qualification: "",
    companyId: undefined,
    sort: 0,
    status: 1,
    salaryContent: "",
    positionContent: "",
    employeeWelfare: ""
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
  salaryRange: [{ required: true, message: "请选择或输入薪资范围", trigger: "change" }],
  workingHours: [{ required: true, message: "请选择工作经验", trigger: "change" }],
  qualification: [{ required: true, message: "请选择学历", trigger: "change" }],
  salaryContent: [{ required: true, message: "请填写薪资详情", trigger: "blur" }],
  positionContent: [{ required: true, message: "请填写岗位详情", trigger: "blur" }]
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

async function show(data) {
  activeTab.value = "basic"
  options.visible = true
  await loadCompanies()
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      salaryRange: data.salaryRange ?? "",
      workingHours: data.workingHours ?? "",
      qualification: data.qualification ?? "",
      companyId: data.companyId,
      sort: data.sort ?? 0,
      status: data.status ?? 1,
      salaryContent: data.salaryContent ?? "",
      positionContent: data.positionContent ?? "",
      employeeWelfare: data.employeeWelfare ?? ""
    })
    // 编辑时保证当前公司在选项中
    if (data.companyId && !companyOptions.value.some(item => item.id === data.companyId)) {
      companyOptions.value.unshift({
        id: data.companyId,
        name: data.companyName || String(data.companyId)
      })
    }
    options.title = "编辑招聘"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增招聘"
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
    salaryRange: form.value.salaryRange,
    workingHours: form.value.workingHours,
    qualification: form.value.qualification,
    companyId: form.value.companyId || undefined,
    sort: form.value.sort,
    status: form.value.status,
    salaryContent: form.value.salaryContent,
    positionContent: form.value.positionContent,
    employeeWelfare: form.value.employeeWelfare || undefined
  }
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      activeTab.value = "basic"
      ElMessage.error("表单校验不通过，请检查基础信息与详情")
      return
    }
    if (!form.value.salaryContent?.trim() || !form.value.positionContent?.trim()) {
      activeTab.value = "detail"
      ElMessage.error("请完善薪资详情与岗位详情")
      return
    }
    options.loading = true
    const payload = buildPayload()
    const api = isEdit.value
      ? updateRecruitmentApi({ id: form.value.id, ...payload })
      : createRecruitmentApi(payload)
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
              <el-form-item label="岗位名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入岗位名称" />
              </el-form-item>

              <el-form-item label="所属公司" prop="companyId">
                <el-select
                  v-model="form.companyId"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请选择公司（选填）"
                  class="full-width"
                  :remote-method="loadCompanies"
                  :loading="companyLoading"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="薪资范围" prop="salaryRange">
                    <el-select
                      v-model="form.salaryRange"
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选择或输入，如 5000-6000"
                      class="full-width"
                    >
                      <el-option
                        v-for="item in SALARY_RANGE_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工作经验" prop="workingHours">
                    <el-select v-model="form.workingHours" placeholder="请选择" class="full-width">
                      <el-option
                        v-for="item in WORKING_HOURS_OPTIONS"
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
                  <el-form-item label="学历要求" prop="qualification">
                    <el-select v-model="form.qualification" placeholder="请选择" class="full-width">
                      <el-option
                        v-for="item in QUALIFICATION_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
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
              </el-row>

              <el-form-item label="排序" prop="sort">
                <el-input-number
                  v-model="form.sort"
                  :min="0"
                  controls-position="right"
                  class="full-width"
                />
              </el-form-item>
            </div>
          </el-tab-pane>

          <el-tab-pane label="岗位详情" name="detail">
            <div class="tab-pane-body">
              <el-form-item label="薪资详情" prop="salaryContent" label-position="top">
                <RichEditor v-model="form.salaryContent" height="220px" />
              </el-form-item>
              <el-form-item label="岗位详情" prop="positionContent" label-position="top">
                <RichEditor v-model="form.positionContent" height="220px" />
              </el-form-item>
              <el-form-item label="员工福利" prop="employeeWelfare" label-position="top">
                <RichEditor v-model="form.employeeWelfare" height="180px" />
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="close">
          取消
        </el-button>
        <el-button type="primary" :loading="options.loading" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-body {
  height: 100%;
}

.form-tabs {
  height: 100%;

  :deep(.el-tabs__content) {
    height: calc(100% - 55px);
    overflow: auto;
  }
}

.tab-pane-body {
  padding-right: 8px;
}

.full-width {
  width: 100%;
}

.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
