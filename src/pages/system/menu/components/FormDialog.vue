<script setup>
import { createMenuApi, getMenuTreeApi, updateMenuApi } from "@@/apis/menus"
import IconSelect from "@@/components/IconSelect/index.vue"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: ""
})

const menuTypeOptions = [
  { label: "目录", value: 1 },
  { label: "菜单", value: 2 },
  { label: "按钮", value: 3 }
]

const visibleOptions = [
  { label: "显示", value: 1 },
  { label: "隐藏", value: 0 }
]

const statusOptions = [
  { label: "正常", value: 1 },
  { label: "停用", value: 0 }
]

const cacheOptions = [
  { label: "缓存", value: 1 },
  { label: "不缓存", value: 0 }
]

function initForm() {
  return {
    id: "",
    parentId: "0",
    menuName: "",
    menuType: 1,
    icon: "",
    sort: 0,
    path: "",
    component: "",
    permCode: "",
    remark: "",
    visible: 1,
    status: 1,
    isCache: 0
  }
}

const loading = ref(false)
const form = ref(initForm())
const formRef = useTemplateRef("formRef")
const menuTree = ref([])

const isEdit = computed(() => !!form.value.id)

const parentTreeOptions = computed(() => [
  { id: "0", menuName: "根节点", children: menuTree.value }
])

const treeSelectProps = {
  label: "menuName",
  children: "children"
}

const rules = {
  parentId: [{ required: true, message: "请选择父菜单", trigger: "change" }],
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  permCode: [{ required: true, message: "请输入权限字符", trigger: "blur" }],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
  visible: [{ required: true, message: "请选择显示状态", trigger: "change" }],
  status: [{ required: true, message: "请选择菜单状态", trigger: "change" }],
  isCache: [{ required: true, message: "请选择是否缓存", trigger: "change" }]
}

async function loadMenuTree() {
  const { data } = await getMenuTreeApi()
  menuTree.value = data
}

/** 打开弹框：新增 show()，编辑 show(row) 或 show(row, "edit") */
async function show(data, type) {
  await loadMenuTree()
  const isEditMode = type === "edit" || (!type && !!data)
  options.visible = true
  if (isEditMode && data) {
    Object.assign(form.value, initForm(), {
      id: data.id,
      parentId: data.parentId ?? "0",
      menuName: data.menuName,
      menuType: data.menuType,
      icon: data.icon ?? "",
      sort: data.sort,
      path: data.path ?? "",
      component: data.component ?? "",
      permCode: data.permCode ?? "",
      remark: data.remark ?? "",
      visible: data.visible,
      status: data.status,
      isCache: data.isCache
    })
    options.title = "修改菜单"
  } else {
    Object.assign(form.value, initForm())
    options.title = "新增菜单"
  }
}

function close() {
  options.visible = false
  formRef.value?.clearValidate()
  Object.assign(form.value, initForm())
}

function buildSubmitData() {
  const { id, parentId, menuName, menuType, icon, sort, path, component, permCode, remark, visible, status, isCache } = form.value
  const payload = {
    parentId,
    menuName,
    menuType,
    icon,
    sort,
    path,
    component,
    permCode,
    remark,
    visible,
    status,
    isCache
  }
  if (isEdit.value) {
    payload.id = id
  }
  return payload
}

function confirm() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    const api = isEdit.value ? updateMenuApi(buildSubmitData()) : createMenuApi(buildSubmitData())
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
    width="560px"
    @closed="close"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="父菜单" prop="parentId">
        <el-tree-select
          v-model="form.parentId"
          :data="parentTreeOptions"
          :props="treeSelectProps"
          value-key="id"
          check-strictly
          default-expand-all
          placeholder="请选择父菜单"
          class="full-width"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-select v-model="form.menuType" placeholder="请选择" class="full-width">
          <el-option v-for="item in menuTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <IconSelect v-model="form.icon" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" type="number" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="form.component" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="权限字符" prop="permCode">
        <el-input v-model="form.permCode" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="显示状态" prop="visible">
        <el-select v-model="form.visible" placeholder="请选择" class="full-width">
          <el-option v-for="item in visibleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择" class="full-width">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否缓存" prop="isCache">
        <el-select v-model="form.isCache" placeholder="请选择" class="full-width">
          <el-option v-for="item in cacheOptions" :key="item.value" :label="item.label" :value="item.value" />
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
