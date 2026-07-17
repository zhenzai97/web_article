<script setup>
import { createCompanyApi, updateCompanyApi } from "@@/apis/company"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import RichEditor from "@@/components/RichEditor/index.vue"
import { ENABLE_STATUS_OPTIONS } from "@@/constants/article"
import {
  COMPANY_TAG_OPTIONS,
  EXAMINE_STATUS_OPTIONS,
  IDENTITY_OPTIONS,
  SEX_OPTIONS,
  VIP_OPTIONS,
  VIP_TYPE_OPTIONS
} from "@@/constants/company"

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
    name: "",
    nickname: "",
    cover: "",
    license: "",
    intro: "",
    vip: 4,
    vipType: 1,
    identity: undefined,
    sex: 0,
    examineStatus: 1,
    status: 1,
    mobile: "",
    email: "",
    address: "",
    coordinate: "",
    business: "",
    tagList: [],
    annexe: "",
    sort: 0,
    recruitmentDes: ""
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)
const isUnit = computed(() => form.value.vipType === 1)
const isPerson = computed(() => form.value.vipType === 2)

const rules = computed(() => {
  const base = {
    vipType: [{ required: true, message: "请选择会员类型", trigger: "change" }],
    name: [{
      required: true,
      message: isUnit.value ? "请输入单位名称" : "请输入姓名",
      trigger: "blur"
    }],
    nickname: [{
      required: true,
      message: isUnit.value ? "请输入单位简称" : "请输入平台用户名",
      trigger: "blur"
    }],
    address: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
  }
  if (isUnit.value) {
    base.license = [{ required: true, message: "请上传营业执照", trigger: "change" }]
  }
  return base
})

function parseTagList(tag) {
  if (!tag) return []
  return String(tag).split(",").map(item => item.trim()).filter(Boolean)
}

function show(data) {
  activeTab.value = "basic"
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      nickname: data.nickname ?? "",
      cover: data.cover ?? "",
      license: data.license ?? "",
      intro: data.intro ?? "",
      vip: data.vip ?? 4,
      vipType: data.vipType ?? 1,
      identity: data.identity,
      sex: data.sex ?? 0,
      examineStatus: data.examineStatus ?? 1,
      status: data.status ?? 1,
      mobile: data.mobile ?? "",
      email: data.email ?? "",
      address: data.address ?? "",
      coordinate: data.coordinate ?? "",
      business: data.business ?? "",
      tagList: parseTagList(data.tag),
      annexe: data.annexe ?? "",
      sort: data.sort ?? 0,
      recruitmentDes: data.recruitmentDes ?? ""
    })
    options.title = "编辑会员单位"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增会员单位"
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
    nickname: form.value.nickname,
    cover: form.value.cover || undefined,
    license: form.value.license || undefined,
    intro: form.value.intro || undefined,
    vip: form.value.vip,
    vipType: form.value.vipType,
    identity: form.value.identity,
    sex: isPerson.value ? form.value.sex : undefined,
    examineStatus: form.value.examineStatus,
    status: form.value.status,
    mobile: form.value.mobile,
    email: form.value.email || undefined,
    address: form.value.address,
    coordinate: form.value.coordinate || undefined,
    business: form.value.business,
    tag: form.value.tagList?.length ? form.value.tagList.join(",") : undefined,
    annexe: form.value.annexe || undefined,
    sort: form.value.sort,
    recruitmentDes: form.value.recruitmentDes || undefined
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
      ? updateCompanyApi({ id: form.value.id, ...payload })
      : createCompanyApi(payload)
    api.then(() => {
      ElMessage.success("操作成功")
      emit("success")
      close()
    }).finally(() => {
      options.loading = false
    })
  })
}

watch(() => form.value.vipType, () => {
  nextTick(() => formRef.value?.clearValidate())
})

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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="left">
        <el-tabs v-model="activeTab" class="form-tabs">
          <el-tab-pane label="基础信息" name="basic">
            <div class="tab-pane-body">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="会员类型" prop="vipType">
                    <el-select v-model="form.vipType" class="full-width" :disabled="isEdit">
                      <el-option
                        v-for="item in VIP_TYPE_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="会员属性" prop="vip">
                    <el-select v-model="form.vip" class="full-width">
                      <el-option
                        v-for="item in VIP_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item :label="isUnit ? '单位名称' : '姓名'" prop="name">
                <el-input v-model="form.name" :placeholder="isUnit ? '请输入单位名称' : '请输入姓名'" />
              </el-form-item>
              <el-form-item :label="isUnit ? '单位简称' : '平台用户名'" prop="nickname">
                <el-input
                  v-model="form.nickname"
                  :placeholder="isUnit ? '请输入单位简称' : '请输入平台用户名'"
                />
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="封面图" prop="cover">
                    <ImageUpload v-model="form.cover" :width="140" :height="140" />
                  </el-form-item>
                </el-col>
                <el-col v-if="isUnit" :span="12">
                  <el-form-item label="营业执照" prop="license">
                    <ImageUpload v-model="form.license" :width="140" :height="140" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item :label="isUnit ? '公司业务' : '所在行业'" prop="business">
                <el-input
                  v-model="form.business"
                  type="textarea"
                  :rows="2"
                  :placeholder="isUnit ? '请输入公司业务' : '请输入所在行业'"
                />
              </el-form-item>

              <el-form-item v-if="isPerson" label="个人简介" prop="intro">
                <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="请输入个人简介" />
              </el-form-item>
              <el-form-item v-else label="单位介绍" prop="intro">
                <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="单位介绍（选填）" />
              </el-form-item>

              <el-form-item v-if="isPerson" label="个人标签" prop="tagList">
                <el-select
                  v-model="form.tagList"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择标签"
                  class="full-width"
                >
                  <el-option
                    v-for="item in COMPANY_TAG_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入联系电话" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="选填" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入详细地址" />
              </el-form-item>
              <el-form-item label="地理坐标" prop="coordinate">
                <el-input v-model="form.coordinate" placeholder="如 24.41,98.59（选填）" />
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="政治面貌" prop="identity">
                    <el-select v-model="form.identity" clearable placeholder="选填" class="full-width">
                      <el-option
                        v-for="item in IDENTITY_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isPerson" :span="12">
                  <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" class="full-width">
                      <el-option
                        v-for="item in SEX_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="审核状态" prop="examineStatus">
                    <el-select v-model="form.examineStatus" class="full-width">
                      <el-option
                        v-for="item in EXAMINE_STATUS_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
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
                <el-col :span="8">
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

              <el-form-item label="附件地址" prop="annexe">
                <el-input v-model="form.annexe" placeholder="附件 URL（选填）" />
              </el-form-item>
            </div>
          </el-tab-pane>

          <el-tab-pane label="招聘介绍" name="recruit">
            <div class="tab-pane-body">
              <el-form-item label-position="top" prop="recruitmentDes" label-width="0">
                <RichEditor v-model="form.recruitmentDes" />
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
  justify-content: flex-end;
  gap: 12px;
}
</style>
