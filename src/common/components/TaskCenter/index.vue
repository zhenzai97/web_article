<script setup>
import {
  downloadAsyncTaskFileApi,
  getMyAsyncTaskPageApi
} from "@@/apis/async-task"
import { List, Refresh } from "@element-plus/icons-vue"

const STATUS_MAP = {
  0: { label: "排队中", type: "info" },
  1: { label: "执行中", type: "warning" },
  2: { label: "成功", type: "success" },
  3: { label: "失败", type: "danger" }
}

const TYPE_MAP = {
  ARTICLE_IMPORT: "文章导入",
  ARTICLE_EXPORT: "文章导出"
}

const visible = ref(false)
const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({
  current: 1,
  pageSize: 10
})

const runningCount = computed(() =>
  list.value.filter(item => item.status === 0 || item.status === 1).length
)

let timer = null

async function loadTasks() {
  loading.value = true
  try {
    const { data } = await getMyAsyncTaskPageApi({ ...query })
    list.value = data?.records || []
    total.value = data?.total || 0
  } catch {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function open() {
  visible.value = true
  query.current = 1
  loadTasks()
  startPolling()
}

function close() {
  visible.value = false
  stopPolling()
}

function startPolling() {
  stopPolling()
  timer = window.setInterval(() => {
    const hasRunning = list.value.some(item => item.status === 0 || item.status === 1)
    if (visible.value || hasRunning) {
      loadTasks()
    }
  }, 3000)
}

function stopPolling() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function handlePageChange(page) {
  query.current = page
  loadTasks()
}

async function handleDownload(row, fileType) {
  try {
    await downloadAsyncTaskFileApi(row.id, fileType)
  } catch {
    ElMessage.error("下载失败")
  }
}

onMounted(() => {
  loadTasks()
  startPolling()
})

onBeforeUnmount(stopPolling)

defineExpose({ open })
</script>

<template>
  <div class="task-center">
    <el-badge :value="runningCount" :hidden="runningCount === 0" :max="99">
      <el-tooltip effect="dark" content="任务中心" placement="bottom">
        <el-icon :size="20" @click="open">
          <List />
        </el-icon>
      </el-tooltip>
    </el-badge>

    <el-drawer
      v-model="visible"
      title="任务中心"
      size="420px"
      append-to-body
      @closed="close"
    >
      <div class="task-toolbar">
        <span class="tip">导入 / 导出任务进度</span>
        <el-button :icon="Refresh" link :loading="loading" @click="loadTasks">
          刷新
        </el-button>
      </div>

      <div v-loading="loading" class="task-list">
        <el-empty v-if="!list.length" description="暂无任务" :image-size="72" />
        <div v-for="item in list" :key="item.id" class="task-item">
          <div class="task-item__head">
            <div class="title">
              {{ item.taskName || TYPE_MAP[item.taskType] || item.taskType }}
            </div>
            <el-tag size="small" :type="STATUS_MAP[item.status]?.type || 'info'">
              {{ STATUS_MAP[item.status]?.label || "未知" }}
            </el-tag>
          </div>
          <el-progress
            :percentage="item.progress || 0"
            :status="item.status === 2 ? 'success' : item.status === 3 ? 'exception' : undefined"
            :stroke-width="10"
          />
          <div class="task-item__meta">
            <span>成功 {{ item.successCount || 0 }} / 失败 {{ item.failCount || 0 }} / 共 {{ item.totalCount || 0 }}</span>
            <span>{{ item.createTime || "-" }}</span>
          </div>
          <div v-if="item.errorMsg" class="task-item__error">
            {{ item.errorMsg }}
          </div>
          <div class="task-item__actions">
            <el-button
              v-if="item.resultFileUrl"
              type="primary"
              link
              size="small"
              @click="handleDownload(item, 'result')"
            >
              下载结果
            </el-button>
            <el-button
              v-if="item.failFileUrl"
              type="danger"
              link
              size="small"
              @click="handleDownload(item, 'fail')"
            >
              失败明细
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="total > query.pageSize" class="task-pager">
        <el-pagination
          layout="prev, pager, next"
          :current-page="query.current"
          :page-size="query.pageSize"
          :total="total"
          small
          @current-change="handlePageChange"
        />
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.task-center {
  display: flex;
  align-items: center;
}

.task-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .tip {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.task-list {
  min-height: 200px;
}

.task-item {
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-bg-color);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;

    .title {
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__error {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-color-danger);
    word-break: break-all;
  }

  &__actions {
    margin-top: 6px;
  }
}

.task-pager {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}
</style>
