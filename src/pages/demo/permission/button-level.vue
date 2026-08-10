<script setup>
import { checkPermission } from "@@/utils/permission"
import { PERM } from "@@/constants/permission"
import SwitchRoles from "./components/SwitchRoles.vue"
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <el-card header="权限指令 v-permission 示例（按 permCode）" shadow="never" class="margin-top-20">
      <el-button v-permission="PERM.systemUser.add">
        system:user:add
      </el-button>
      <el-button v-permission="[PERM.contentArticle.edit, PERM.contentArticle.delete]">
        文章编辑或删除
      </el-button>
      <el-button v-permission="'admin'">
        兼容：超级管理员角色 admin
      </el-button>
    </el-card>
    <el-card header="权限函数 checkPermission 示例" shadow="never" class="margin-top-20">
      <el-text type="warning" size="large">
        Element Plus 的 el-tab-pane / el-table-column 等动态 DOM 场景请用 v-if + checkPermission
      </el-text>
      <el-tabs type="border-card" class="margin-top-20">
        <el-tab-pane v-if="checkPermission(PERM.systemUser.add)" label="新增用户">
          <el-tag size="large">
            v-if="checkPermission(PERM.systemUser.add)"
          </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission('admin')" label="admin">
          <el-tag size="large">
            v-if="checkPermission('admin')"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}
</style>
