<script setup>
import { getProjectConfigApi, updateProjectConfigApi } from "@@/apis/project-config"
import { PERM } from "@@/constants/permission"
import { Refresh } from "@element-plus/icons-vue"

defineOptions({
  name: "OperationProjectConfig"
})

const loading = ref(false)
const saving = ref(false)

const form = reactive({
  id: "",
  videoPlay: 1,
  createTime: "",
  updateTime: ""
})

async function loadConfig() {
  loading.value = true
  try {
    const { data } = await getProjectConfigApi()
    Object.assign(form, {
      id: data?.id ?? "",
      videoPlay: data?.videoPlay ?? 1,
      createTime: data?.createTime ?? "",
      updateTime: data?.updateTime ?? ""
    })
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.id) {
    ElMessage.warning("配置尚未加载完成")
    return
  }
  saving.value = true
  try {
    await updateProjectConfigApi({
      id: form.id,
      videoPlay: form.videoPlay
    })
    ElMessage.success("保存成功")
    await loadConfig()
  } finally {
    saving.value = false
  }
}

onMounted(loadConfig)
</script>

<template>
  <div v-loading="loading" class="project-config-page app-container">
    <el-card shadow="never" class="main-card">
      <div class="toolbar">
        <div class="tip">
          全局项目基础配置（仅一条）。当前支持配置小程序/站点视频是否自动播放。
        </div>
        <el-button :icon="Refresh" :loading="loading" @click="loadConfig">
          刷新
        </el-button>
      </div>

      <el-form label-width="140px" class="config-form">
        <el-form-item label="视频自动播放">
          <el-switch
            v-model="form.videoPlay"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item v-if="form.updateTime" label="最近更新">
          <span class="meta">{{ form.updateTime }}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="PERM.operationProjectConfig.edit"
            type="primary"
            :loading="saving"
            @click="handleSave"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.project-config-page {
  .main-card {
    max-width: 720px;
  }

  .toolbar {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .tip {
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-secondary);
  }

  .config-form {
    padding-top: 8px;
  }

  .meta {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}
</style>
