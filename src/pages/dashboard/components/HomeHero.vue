<script setup>
import { Briefcase, FolderOpened, Plus } from "@element-plus/icons-vue"

defineProps({
  greeting: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  summary: {
    type: Object,
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section class="home-top">
    <div class="home-hero">
      <div class="hero-content">
        <p class="hero-eyebrow">
          {{ greeting }}，{{ displayName }}
        </p>
        <h1 class="hero-title">
          运营工作台
        </h1>
        <p class="hero-desc">
          文章 {{ summary.articleTotal }} 篇（启用 {{ summary.articleEnabled }}），
          文旅 {{ summary.tourismTotal }} 条；本周新增文章 {{ summary.weekNew }} 篇。
          <template v-if="summary.pendingCount > 0">
            当前待办 {{ summary.pendingCount }} 项
            <template v-if="summary.jadeApplyPending">
              （非洲翠申请待审 {{ summary.jadeApplyPending }}）
            </template>
            <template v-if="summary.advertisingExpiring">
              （广告即将到期 {{ summary.advertisingExpiring }}）
            </template>
            。
          </template>
          <template v-else>
            暂无紧急待办。
          </template>
        </p>
        <div class="hero-actions">
          <router-link to="/content/article">
            <el-button type="primary" :icon="Plus">
              文章管理
            </el-button>
          </router-link>
          <router-link to="/jade/committeeApply">
            <el-button :icon="Briefcase">
              专委会申请
            </el-button>
          </router-link>
          <router-link to="/content/category">
            <el-button :icon="FolderOpened">
              栏目管理
            </el-button>
          </router-link>
        </div>
      </div>
      <div class="hero-workflow">
        <p class="workflow-title">
          运营流程
        </p>
        <div class="workflow-steps">
          <div
            v-for="(step, index) in steps"
            :key="step.label"
            class="workflow-step"
            :class="{ done: step.done }"
          >
            <span class="step-index">{{ index + 1 }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-top {
  margin-bottom: 20px;
}

.home-hero {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  padding: 28px 32px;
  border-radius: 16px;
  color: #f3f4f6;
  background:
    radial-gradient(ellipse 60% 80% at 90% 20%, rgb(212 168 83 / 18%), transparent 55%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.hero-eyebrow {
  margin: 0 0 6px;
  font-size: 13px;
  color: rgb(243 244 246 / 65%);
}

.hero-title {
  margin: 0 0 10px;
  font-size: 1.75rem;
  font-weight: 600;
}

.hero-desc {
  max-width: 560px;
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.6;
  color: rgb(243 244 246 / 60%);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-workflow {
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 12px;
  background: rgb(255 255 255 / 5%);
}

.workflow-title {
  margin: 0 0 16px;
  font-size: 13px;
  color: rgb(243 244 246 / 55%);
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workflow-step {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 13px;
  color: rgb(243 244 246 / 45%);

  &.done {
    color: rgb(243 244 246 / 90%);

    .step-index {
      color: #0f172a;
      background: #d4a853;
    }
  }

  .step-index {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 600;
    background: rgb(255 255 255 / 12%);
  }
}

@media (width <= 992px) {
  .home-hero {
    grid-template-columns: 1fr;
  }
}

@media (width <= 768px) {
  .home-hero {
    padding: 20px;
  }
}
</style>
