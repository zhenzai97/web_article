<script setup>
import { getMenuTreeApi } from "@@/apis/menus"
import { assignRoleMenuApi, getRoleMenuIdsApi } from "@@/apis/roles"

const emit = defineEmits(["success"])

const options = reactive({
  visible: false,
  title: "分配菜单"
})

const loading = ref(false)
const treeLoading = ref(false)
const roleId = ref(null)
const roleName = ref("")
const menuTree = ref([])
const checkedKeys = ref([])
const treeKey = ref(0)
const treeRef = useTemplateRef("treeRef")

const treeProps = {
  label: "menuName",
  children: "children"
}

/** 仅回显叶子节点，避免父子联动导致多余勾选 */
function pickLeafKeys(nodes, idSet) {
  const leaves = []
  const walk = (list) => {
    ;(list || []).forEach((node) => {
      const children = node.children || []
      if (!children.length) {
        if (idSet.has(String(node.id))) {
          leaves.push(node.id)
        }
      } else {
        walk(children)
      }
    })
  }
  walk(nodes)
  return leaves
}

function show(row) {
  if (!row?.id) {
    return
  }
  if (row.isSuperAdmin === 1) {
    ElMessage.warning("超级管理员拥有全部菜单，无需分配")
    return
  }
  roleId.value = row.id
  roleName.value = row.roleName || ""
  options.title = `分配菜单 - ${roleName.value}`
  options.visible = true
  loadData()
}

async function loadData() {
  treeLoading.value = true
  menuTree.value = []
  checkedKeys.value = []
  try {
    const [treeRes, idsRes] = await Promise.all([
      getMenuTreeApi(),
      getRoleMenuIdsApi(roleId.value)
    ])
    const tree = treeRes.data || []
    const idSet = new Set((idsRes.data || []).map(String))
    menuTree.value = tree
    checkedKeys.value = pickLeafKeys(tree, idSet)
    treeKey.value += 1
  } finally {
    treeLoading.value = false
  }
}

function close() {
  options.visible = false
  roleId.value = null
  roleName.value = ""
  menuTree.value = []
  checkedKeys.value = []
}

function confirm() {
  if (!roleId.value) {
    return
  }
  const checked = treeRef.value?.getCheckedKeys(false) || []
  const halfChecked = treeRef.value?.getHalfCheckedKeys() || []
  const menuIds = [...new Set([...checked, ...halfChecked])]
  loading.value = true
  assignRoleMenuApi({
    roleId: roleId.value,
    menuIds
  }).then(() => {
    ElMessage.success("分配成功")
    emit("success")
    close()
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="options.visible"
    :title="options.title"
    width="480px"
    @closed="close"
  >
    <div v-loading="treeLoading" class="menu-tree-wrap">
      <el-tree
        v-if="menuTree.length"
        :key="treeKey"
        ref="treeRef"
        :data="menuTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="treeProps"
        :default-checked-keys="checkedKeys"
      />
      <el-empty v-else-if="!treeLoading" description="暂无菜单数据" />
    </div>
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
.menu-tree-wrap {
  min-height: 240px;
  max-height: 480px;
  overflow: auto;
}
</style>
