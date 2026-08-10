<script setup>
import { PERM } from "@@/constants/permission"
import { getHomeSectionListApi, updateHomeSectionApi } from "@@/apis/home-section"
import { Refresh } from "@element-plus/icons-vue"
import HomePreview from "./components/HomePreview.vue"

defineOptions({
  name: "HomeSection"
})

const loading = ref(false)
const savingId = ref("")
const list = ref([])

const CODE_LABEL = {
  carousel: "轮播",
  channel: "宫格",
  banner: "通栏",
  special: "专题",
  article_home: "首页推荐文章",
  article_dhnews: "精彩德宏",
  article_xhdt: "协会动态",
  activity: "活动一览"
}

async function loadList() {
  loading.value = true
  try {
    const { data } = await getHomeSectionListApi()
    list.value = data || []
  } finally {
    loading.value = false
  }
}

async function saveRow(row) {
  savingId.value = row.id
  try {
    await updateHomeSectionApi({
      id: row.id,
      visible: row.visible,
      sort: row.sort,
      limitNum: row.limitNum
    })
    ElMessage.success("已保存")
  } finally {
    savingId.value = ""
  }
}

onMounted(loadList)
</script>

<template>
  <!--
    根节点会被 Layout 挂上 app-container-grow（display:flex; flex-direction:column），
    左右分栏必须放在内层，否则 grid 会被覆盖成上下堆叠。
  -->
  <div class="home-section-page app-container">
    <div class="home-section-page__layout">
      <el-card shadow="never" class="main-card">
        <div class="toolbar">
          <div class="tip">
            编排小程序首页区块：显隐、排序、条数。右侧为布局效果预览（改完即时反映，保存后小程序生效）。
          </div>
          <el-button :icon="Refresh" :loading="loading" @click="loadList">
            刷新
          </el-button>
        </div>

        <el-table v-loading="loading" :data="list" stripe border>
          <el-table-column prop="code" label="编码" min-width="160">
            <template #default="{ row }">
              <div>{{ row.code }}</div>
              <div class="sub">
                {{ CODE_LABEL[row.code] || "-" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="显示" width="100" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.visible" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="排序" width="140" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.sort" :min="0" controls-position="right" class="num" />
            </template>
          </el-table-column>
          <el-table-column label="条数" width="140" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.limitNum" :min="1" :max="50" controls-position="right" class="num" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-permission="PERM.operationHomeSection.edit"
                type="primary"
                text
                bg
                size="small"
                :loading="savingId === row.id"
                @click="saveRow(row)"
              >
                保存
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <aside class="preview-pane">
        <HomePreview :list="list" />
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-section-page {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.home-section-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;
  width: 100%;
}

.main-card {
  min-width: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tip {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.sub {
  margin-top: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.num {
  width: 100%;
}

.preview-pane {
  position: sticky;
  top: 0;
  width: 320px;
  max-height: calc(100vh - 140px);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);
  overflow: auto;
}
</style>
