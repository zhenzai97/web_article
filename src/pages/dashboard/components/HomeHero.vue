<script setup>
import heroBg from "@@/assets/images/login/微信图片_20260825165512_87_15.jpg"
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

      <aside class="hero-aside">
        <img class="hero-aside__img" :src="heroBg" alt="勐焕大金塔">
        <div class="hero-aside__mask" />
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
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-top {
  margin-bottom: 20px;
}

.home-hero {
  display: grid;
  grid-template-columns: 1fr minmax(240px, 300px);
  gap: 20px;
  min-height: 240px;
  padding: 28px 28px 28px 32px;
  border-radius: 16px;
  color: #fff;
  background:
    radial-gradient(ellipse 50% 90% at 0% 100%, rgb(0 189 210 / 22%), transparent 55%),
    linear-gradient(135deg, #000835 0%, #0a1a4a 55%, #063a48 100%);
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.hero-eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  color: rgb(255 255 255 / 65%);
}

.hero-title {
  margin: 0 0 12px;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.hero-desc {
  max-width: 520px;
  margin: 0 0 22px;
  font-size: 14px;
  line-height: 1.7;
  color: rgb(255 255 255 / 62%);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  :deep(.el-button:not(.el-button--primary)) {
    color: #fff;
    background: rgb(255 255 255 / 10%);
    border-color: rgb(255 255 255 / 18%);

    &:hover {
      background: rgb(255 255 255 / 18%);
      border-color: rgb(255 255 255 / 30%);
    }
  }
}

.hero-aside {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  border-radius: 14px;
}

.hero-aside__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 22%;
}

.hero-aside__mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 8 53 / 10%) 0%, rgb(0 8 53 / 78%) 70%, rgb(0 8 53 / 88%) 100%);
}

.hero-workflow {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 16px 18px 18px;
}

.workflow-title {
  margin: 0 0 12px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgb(255 255 255 / 70%);
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workflow-step {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 13px;
  color: rgb(255 255 255 / 55%);

  &.done {
    color: #fff;

    .step-index {
      color: #003d44;
      background: #00bdd2;
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
    background: rgb(255 255 255 / 16%);
  }
}

@media (width <= 992px) {
  .home-hero {
    grid-template-columns: 1fr;
  }

  .hero-aside {
    min-height: 200px;
  }
}

@media (width <= 768px) {
  .home-hero {
    padding: 20px;
  }
}
</style>
