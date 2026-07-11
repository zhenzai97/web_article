<script setup>
import { VideoPlay } from "@element-plus/icons-vue"

const props = defineProps({
  /** 视频地址，支持 https 等网络路径 */
  src: {
    type: String,
    default: ""
  },
  /** 预览弹窗标题 */
  title: {
    type: String,
    default: "视频预览"
  },
  /** 表格内图标尺寸 */
  iconSize: {
    type: Number,
    default: 20
  },
  /** 无视频时的占位文本 */
  emptyText: {
    type: String,
    default: "-"
  },
  /** 弹窗宽度 */
  dialogWidth: {
    type: String,
    default: "720px"
  },
  /** 打开预览后是否自动播放 */
  autoplay: {
    type: Boolean,
    default: true
  },
  /** 是否显示播放控件 */
  controls: {
    type: Boolean,
    default: true
  }
})

const visible = ref(false)
const videoRef = useTemplateRef("videoRef")

function handleOpen() {
  if (!props.src) return
  visible.value = true
}

function handleClose() {
  const video = videoRef.value
  if (video) {
    video.pause()
    video.currentTime = 0
  }
  visible.value = false
}

watch(visible, (show) => {
  if (!show || !props.autoplay) return
  nextTick(() => {
    videoRef.value?.play().catch(() => {})
  })
})
</script>

<template>
  <div class="video-display">
    <button
      v-if="src"
      type="button"
      class="video-display__trigger"
      title="点击预览视频"
      @click="handleOpen"
    >
      <el-icon :size="iconSize">
        <VideoPlay />
      </el-icon>
    </button>
    <span v-else class="video-display__empty">{{ emptyText }}</span>

    <el-dialog
      v-model="visible"
      :title="title"
      :width="dialogWidth"
      append-to-body
      destroy-on-close
      class="video-display-dialog"
      @close="handleClose"
    >
      <video
        ref="videoRef"
        class="video-display__player"
        :src="src"
        :controls="controls"
        playsinline
        preload="metadata"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.video-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    border-radius: 4px;
    color: var(--el-color-primary);
    background: transparent;
    cursor: pointer;
    transition:
      background-color 0.2s,
      color 0.2s;

    &:hover {
      color: var(--el-color-primary-light-3);
      background: var(--el-color-primary-light-9);
    }
  }

  &__empty {
    color: var(--el-text-color-placeholder);
  }

  &__player {
    display: block;
    width: 100%;
    max-height: 70vh;
    background: #000;
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
.video-display-dialog {
  .el-dialog__body {
    padding-top: 8px;
  }
}
</style>
