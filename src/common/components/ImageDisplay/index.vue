<script setup>
import { Loading, Picture } from "@element-plus/icons-vue"

const props = defineProps({
  /** 图片地址，支持 https 等网络路径 */
  src: {
    type: String,
    default: ""
  },
  /** 图片宽度，数字默认 px，也可传 100% 等字符串 */
  width: {
    type: [String, Number],
    default: 80
  },
  /** 图片高度，数字默认 px，也可传 100% 等字符串 */
  height: {
    type: [String, Number],
    default: 80
  },
  /**
   * 图片显示格式，对应 CSS object-fit
   * fill | contain | cover | none | scale-down
   */
  fit: {
    type: String,
    default: "cover",
    validator: value => ["fill", "contain", "cover", "none", "scale-down"].includes(value)
  },
  /** 圆角，数字默认 px */
  radius: {
    type: [String, Number],
    default: 4
  },
  /** 是否开启点击预览 */
  preview: {
    type: Boolean,
    default: true
  },
  /** 预览图列表，默认仅预览当前 src */
  previewList: {
    type: Array,
    default: undefined
  },
  /** 预览列表中的初始索引 */
  previewIndex: {
    type: Number,
    default: 0
  },
  /** 是否懒加载 */
  lazy: {
    type: Boolean,
    default: true
  },
  /** 图片 alt 文本 */
  alt: {
    type: String,
    default: ""
  }
})

function normalizeSize(size) {
  return typeof size === "number" ? `${size}px` : size
}

const imageStyle = computed(() => ({
  width: normalizeSize(props.width),
  height: normalizeSize(props.height),
  borderRadius: normalizeSize(props.radius)
}))

const previewSrcList = computed(() => {
  if (!props.preview || !props.src) {
    return undefined
  }
  const list = props.previewList?.length ? props.previewList.filter(Boolean) : [props.src]
  return list.length ? list : undefined
})
</script>

<template>
  <el-image
    v-if="src"
    :src="src"
    :fit="fit"
    :lazy="lazy"
    :alt="alt"
    :style="imageStyle"
    :class="{ 'is-previewable': preview && previewSrcList }"
    :preview-src-list="previewSrcList"
    :initial-index="previewIndex"
    preview-teleported
    hide-on-click-modal
    class="image-display"
  >
    <template #placeholder>
      <div class="image-display__fallback">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </div>
    </template>
    <template #error>
      <div class="image-display__fallback is-error">
        <el-icon>
          <Picture />
        </el-icon>
      </div>
    </template>
  </el-image>
  <div v-else class="image-display image-display--empty" :style="imageStyle">
    <el-icon>
      <Picture />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.image-display {
  display: block;
  overflow: hidden;
  background: var(--el-fill-color-light);

  &.is-previewable {
    cursor: zoom-in;
  }

  :deep(.el-image__inner) {
    width: 100%;
    height: 100%;
  }

  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--el-text-color-placeholder);
    background: var(--el-fill-color-light);

    &.is-error {
      color: var(--el-text-color-secondary);
    }
  }

  &--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-placeholder);
  }
}
</style>
