<script setup>
import { deleteMenuApi, getMenuTreeApi } from "@@/apis/menus"
import PageLayout from "@@/components/PageLayout/index.vue"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { CirclePlus } from "@element-plus/icons-vue"
import FormDialog from "./components/FormDialog.vue"

defineOptions({
  name: "SystemMenu"
})

const formDialogRef = useTemplateRef("formDialogRef")

const loading = ref(false)
const tableData = ref([])

const menuTypeMap = {
  1: "目录",
  2: "菜单",
  3: "按钮"
}

function getMenuIconComponent(icon) {
  if (!icon || !(icon in ElementPlusIconsVue)) {
    return null
  }
  return ElementPlusIconsVue[icon]
}

async function loadMenuTree() {
  loading.value = true
  try {
    const { data } = await getMenuTreeApi()
    tableData.value = data
  } catch {
    tableData.value = []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  formDialogRef.value?.show()
}

function handleUpdate(row) {
  formDialogRef.value?.show(row)
}

function handleDelete(row) {
  ElMessageBox.confirm(`正在删除菜单：${row.menuName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMenuApi(row.id).then(() => {
      ElMessage.success("删除成功")
      loadMenuTree()
    })
  })
}

onMounted(loadMenuTree)
</script>

<template>
  <PageLayout>
    <template #toolbar>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
        新增菜单
      </el-button>
    </template>

    <template #table>
      <div v-loading="loading" class="menu-table">
        <el-table
          stripe
          row-key="id"
          default-expand-all
          :data="tableData"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="menuName" label="菜单名称" min-width="160" />
          <el-table-column prop="menuType" label="菜单类型" align="center" min-width="90">
            <template #default="{ row }">
              {{ menuTypeMap[row.menuType] ?? row.menuType }}
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="图标" align="center" min-width="100">
            <template #default="{ row }">
              <component
                :is="getMenuIconComponent(row.icon)"
                v-if="getMenuIconComponent(row.icon)"
                class="menu-icon"
              />
              <span v-else>{{ row.icon || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center" width="80" />
          <el-table-column prop="path" label="路由地址" min-width="140" />
          <el-table-column prop="component" label="组件路径" min-width="160" />
          <el-table-column prop="permCode" label="权限字符" min-width="120" />
          <el-table-column prop="visible" label="显示状态" align="center" width="90">
            <template #default="{ row }">
              <el-tag v-if="row.visible === 1" type="success" effect="plain" disable-transitions>
                显示
              </el-tag>
              <el-tag v-else type="info" effect="plain" disable-transitions>
                隐藏
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="菜单状态" align="center" width="90">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" effect="plain" disable-transitions>
                正常
              </el-tag>
              <el-tag v-else type="danger" effect="plain" disable-transitions>
                停用
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isCache" label="是否缓存" align="center" width="90">
            <template #default="{ row }">
              <el-tag v-if="row.isCache === 1" type="primary" effect="plain" disable-transitions>
                缓存
              </el-tag>
              <el-tag v-else type="info" effect="plain" disable-transitions>
                不缓存
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" text bg size="small" @click="handleUpdate(row)">
                修改
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </PageLayout>
  <FormDialog ref="formDialogRef" @success="loadMenuTree" />
</template>

<style lang="scss" scoped>
.menu-icon {
  width: 18px;
  height: 18px;
}
</style>
