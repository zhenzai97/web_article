<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const CODE_LABEL = {
  carousel: "轮播",
  channel: "宫格",
  banner: "通栏",
  special: "专题",
  article_home: "首页推荐",
  article_dhnews: "精彩德宏",
  article_xhdt: "协会动态",
  activity: "活动一览"
}

/** 可见区块，按 sort 降序（与小程序一致） */
const previewBlocks = computed(() => {
  return [...(props.list || [])]
    .filter(item => item.visible === 1)
    .sort((a, b) => (b.sort || 0) - (a.sort || 0))
    .map(item => ({
      ...item,
      label: CODE_LABEL[item.code] || item.code,
      placeholders: Array.from({ length: Math.min(item.limitNum || 1, 6) }, (_, i) => i)
    }))
})
</script>

<template>
  <div class="preview-wrap">
    <!-- <div class="preview-title">
      小程序首页预览
    </div> -->
    <div class="phone">
      <div class="phone__notch" />
      <div class="phone__status">
        <span>9:41</span>
        <span>德宏州新媒体协会</span>
        <span>100%</span>
      </div>
      <el-scrollbar class="phone__body" max-height="calc(100vh - 280px)">
        <div class="phone__body-inner">
          <div v-if="!previewBlocks.length" class="phone__empty">
            暂无显示中的区块
          </div>
          <div
            v-for="block in previewBlocks"
            :key="block.id || block.code"
            class="block"
            :class="`block--${block.code}`"
          >
            <div class="block__head">
              <span>{{ block.label }}</span>
              <span class="block__meta">×{{ block.limitNum }}</span>
            </div>

            <!-- 轮播 -->
            <div v-if="block.code === 'carousel'" class="mock-carousel">
              <div class="mock-carousel__banner" />
              <div class="mock-carousel__dots">
                <i /><i class="active" /><i />
              </div>
            </div>

            <!-- 宫格 -->
            <div v-else-if="block.code === 'channel'" class="mock-channel">
              <div
                v-for="n in block.placeholders"
                :key="n"
                class="mock-channel__item"
              />
            </div>

            <!-- 通栏 -->
            <div v-else-if="block.code === 'banner'" class="mock-banner" />

            <!-- 专题 -->
            <div v-else-if="block.code === 'special'" class="mock-special">
              <div
                v-for="n in Math.min(block.placeholders.length, 2)"
                :key="n"
                class="mock-special__item"
              />
            </div>

            <!-- 文章 / 列表类 -->
            <div v-else class="mock-list">
              <div
                v-for="n in block.placeholders"
                :key="n"
                class="mock-list__item"
                :class="{ 'mock-list__item--hero': block.code === 'article_home' && n === 0 }"
              >
                <div class="mock-list__thumb" />
                <div class="mock-list__lines">
                  <i /><i />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="phone__home-bar" />
    </div>
    <p class="preview-tip">
      仅示意布局顺序与显隐，非真实内容
    </p>
  </div>
</template>

<style lang="scss" scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 8px;
}

.preview-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.preview-tip {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.phone {
  width: 280px;
  flex-shrink: 0;
  border: 2px solid #1f2937;
  border-radius: 28px;
  background: #0f172a;
  box-shadow: 0 12px 32px rgb(15 23 42 / 18%);
  overflow: hidden;
}

.phone__notch {
  width: 96px;
  height: 8px;
  margin: 8px auto 0;
  border-radius: 999px;
  background: #111827;
}

.phone__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px 6px;
  font-size: 10px;
  color: rgb(243 244 246 / 75%);
}

.phone__body {
  min-height: 420px;
  background: linear-gradient(180deg, #e8eefc 0%, #f5f7fb 40%, #f8fafc 100%);

  :deep(.el-scrollbar__view) {
    min-height: 420px;
  }
}

.phone__body-inner {
  padding: 8px 10px 12px;
}

.phone__empty {
  padding: 48px 12px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

.phone__home-bar {
  width: 96px;
  height: 4px;
  margin: 8px auto 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 35%);
}

.block {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 6%);
}

.block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

.block__meta {
  font-weight: 400;
  color: #94a3b8;
}

.mock-carousel__banner {
  height: 88px;
  border-radius: 8px;
  background: linear-gradient(135deg, #93c5fd, #60a5fa 50%, #3b82f6);
}

.mock-carousel__dots {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 6px;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cbd5e1;

    &.active {
      background: #3b82f6;
    }
  }
}

.mock-channel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mock-channel__item {
  aspect-ratio: 1;
  border-radius: 8px;
  background: linear-gradient(145deg, #dbeafe, #bfdbfe);
}

.mock-banner {
  height: 42px;
  border-radius: 8px;
  background: linear-gradient(90deg, #93c5fd, #60a5fa);
}

.mock-special {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mock-special__item {
  height: 52px;
  border-radius: 8px;
  background: linear-gradient(145deg, #c7d2fe, #a5b4fc);
}

.mock-list__item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &--hero {
    flex-direction: column;

    .mock-list__thumb {
      width: 100%;
      height: 72px;
    }

    .mock-list__lines {
      width: 100%;
    }
  }
}

.mock-list__thumb {
  flex-shrink: 0;
  width: 56px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
}

.mock-list__lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  justify-content: center;

  i {
    display: block;
    height: 6px;
    border-radius: 3px;
    background: #e2e8f0;

    &:first-child {
      width: 88%;
    }

    &:last-child {
      width: 56%;
    }
  }
}
</style>
