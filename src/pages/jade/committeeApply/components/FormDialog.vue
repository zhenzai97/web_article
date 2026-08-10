<script setup>
import { createJadeCommitteeApplyApi, updateJadeCommitteeApplyApi } from "@@/apis/jade-committee-apply"
import ImageUpload from "@@/components/ImageUpload/index.vue"
import { JADE_AUDIT_RESULT_OPTIONS, JADE_VIP_ATTRIBUTE_OPTIONS } from "@@/constants/jade"

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
    contact: "",
    contactInfo: "",
    address: "",
    business: "",
    intro: "",
    vipAttribute: "1",
    cover: "",
    annexe: "",
    uMobile: "",
    openId: "",
    uidSourceId: "",
    auditResult: 0
  }
}

const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

function show(data) {
  options.visible = true
  if (data?.id) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      name: data.name ?? "",
      contact: data.contact ?? "",
      contactInfo: data.contactInfo ?? "",
      address: data.address ?? "",
      business: data.business ?? "",
      intro: data.intro ?? "",
      vipAttribute: data.vipAttribute ?? "1",
      cover: data.cover ?? "",
      annexe: data.annexe ?? "",
      uMobile: data.uMobile ?? "",
      openId: data.openId ?? "",
      uidSourceId: data.uidSourceId ?? "",
      auditResult: data.auditResult ?? 0
    })
    options.title = "编辑非洲翠专委会申请"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增非洲翠专委会申请"
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
    contact: form.value.contact || undefined,
    contactInfo: form.value.contactInfo || undefined,
    address: form.value.address || undefined,
    business: form.value.business || undefined,
    intro: form.value.intro || undefined,
    vipAttribute: form.value.vipAttribute || undefined,
    cover: form.value.cover || undefined,
    annexe: form.value.annexe || undefined,
    uMobile: form.value.uMobile || undefined,
    openId: form.value.openId || undefined,
    uidSourceId: form.value.uidSourceId || undefined,
    auditResult: form.value.auditResult
  }
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    options.loading = true
    const payload = buildPayload()
    const api = isEdit.value
      ? updateJadeCommitteeApplyApi({ id: form.value.id, ...payload })
      : createJadeCommitteeApplyApi(payload)
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
    size="560px"
    destroy-on-close
    @closed="close"
  >
    <div v-loading="options.loading" class="drawer-body">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px" label-position="left">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contactInfo">
              <el-input v-model="form.contactInfo" placeholder="电话/微信等" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="联系地址" />
        </el-form-item>
        <el-form-item label="业务" prop="business">
          <el-input v-model="form.business" placeholder="主营业务" />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input
            v-model="form.intro"
            type="textarea"
            :rows="3"
            placeholder="申请简介"
          />
        </el-form-item>
        <el-form-item label="会员属性" prop="vipAttribute">
          <el-select v-model="form.vipAttribute" class="full-width">
            <el-option
              v-for="item in JADE_VIP_ATTRIBUTE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <ImageUpload v-model="form.cover" :width="160" :height="160" />
        </el-form-item>
        <el-form-item label="附件" prop="annexe">
          <el-input v-model="form.annexe" placeholder="附件 URL" />
        </el-form-item>
        <el-form-item label="用户手机" prop="uMobile">
          <el-input v-model="form.uMobile" placeholder="用户手机号" />
        </el-form-item>
        <el-form-item label="OpenID" prop="openId">
          <el-input
            v-model="form.openId"
            placeholder="微信 OpenID"
            :readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="来源用户ID" prop="uidSourceId">
          <el-input
            v-model="form.uidSourceId"
            placeholder="来源用户 ID"
            :readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="auditResult">
          <el-select v-model="form.auditResult" class="full-width">
            <el-option
              v-for="item in JADE_AUDIT_RESULT_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
