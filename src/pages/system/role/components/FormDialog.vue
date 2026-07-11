<script setup>
import { createRoleApi, updateRoleApi } from "@@/apis/roles"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: ""
})

function initForm() {
  return {
    id: "",
    roleCode: "",
    roleName: "",
    roleDesc: "",
    sort: 0,
    status: 1
  }
}

const loading = ref(false)
const form = ref(initForm())
const formRef = useTemplateRef("formRef")

const isEdit = computed(() => !!form.value.id)

const rules = {
  roleCode: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
}

/** 打开弹框：新增 show()，编辑 show(row) 或 show(row, "edit") */
function show(data, type) {
  const isEditMode = type === "edit" || (!type && !!data)
  options.visible = true
  if (isEditMode && data) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      roleCode: data.roleCode,
      roleName: data.roleName,
      roleDesc: data.roleDesc ?? "",
      sort: data.sort,
      status: data.status
    })
    options.title = "修改角色"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增角色"
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
      ? updateRoleApi({
          id: form.value.id,
          roleCode: form.value.roleCode,
          roleName: form.value.roleName,
          roleDesc: form.value.roleDesc,
          sort: form.value.sort,
          status: form.value.status
        })
      : createRoleApi({
          roleCode: form.value.roleCode,
          roleName: form.value.roleName,
          roleDesc: form.value.roleDesc,
          sort: form.value.sort
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
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="form.roleCode" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="form.roleDesc" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" type="number" placeholder="请输入" />
      </el-form-item>
      <el-form-item v-if="isEdit" label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择" class="full-width">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
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
