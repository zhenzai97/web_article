<script setup>
import { createUserApi, updateUserApi } from "@@/apis/users"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: ""
})

const roleOptions = [
  { label: "管理员", value: "admin" },
  { label: "普通用户", value: "user" },
  { label: "禁用", value: "ban" }
]

function initForm() {
  return {
    id: "",
    userAccount: "",
    userName: "",
    userProfile: "",
    userRole: "user"
  }
}

const loading = ref(false)
const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const displayRoleOptions = computed(() =>
  isEdit.value ? roleOptions : roleOptions.filter(item => item.value !== "ban")
)

const rules = {
  userAccount: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  userName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }]
}

/** 打开弹框：新增 show()，编辑 show(row) 或 show(row, "edit") */
function show(data, type) {
  const isEditMode = type === "edit" || (!type && !!data)
  options.visible = true
  if (isEditMode && data) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      userAccount: data.userAccount,
      userName: data.userName ?? "",
      userProfile: data.userProfile ?? "",
      userRole: data.userRole
    })
    options.title = "修改用户"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增用户"
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
    const api = isEdit.value
      ? updateUserApi({
          id: form.value.id,
          userName: form.value.userName,
          userProfile: form.value.userProfile,
          userRole: form.value.userRole
        })
      : createUserApi({
          userAccount: form.value.userAccount,
          userName: form.value.userName,
          userRole: form.value.userRole
        })
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
    width="30%"
    @closed="close"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item v-if="!isEdit" label="用户账号" prop="userAccount">
        <el-input v-model="form.userAccount" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入" />
      </el-form-item>
      <el-form-item v-if="isEdit" label="用户简介" prop="userProfile">
        <el-input v-model="form.userProfile" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户角色" prop="userRole">
        <el-select v-model="form.userRole" placeholder="请选择" class="full-width">
          <el-option
            v-for="item in displayRoleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
</style>
