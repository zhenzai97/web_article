<script setup>
import { resolveUploadUrl, uploadOssApi } from "@@/apis/upload"
import { Close, Plus } from "@element-plus/icons-vue"

const props = defineProps({
  /** 预览宽度 */
  width: {
    type: [String, Number],
    default: 120
  },
  /** 预览高度 */
  height: {
    type: [String, Number],
    default: 120
  },
  /** 最大文件大小（MB） */
  maxSize: {
    type: Number,
    default: 2
  },
  /** 接受的图片类型 */
  accept: {
    type: String,
    default: "image/jpeg,image/png,image/gif,image/webp"
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 提示文案 */
  tip: {
    type: String,
    default: "支持 JPG / PNG / GIF / WebP，大小不超过 2MB"
  }
})

const model = defineModel({ type: String, default: "" })

const uploading = ref(false)

const uploadStyle = computed(() => ({
  "--image-upload-width": normalizeSize(props.width),
  "--image-upload-height": normalizeSize(props.height)
}))

const acceptTypes = computed(() => props.accept.split(",").map(item => item.trim()).filter(Boolean))

function normalizeSize(size) {
  return typeof size === "number" ? `${size}px` : size
}

function beforeUpload(file) {
  if (!file.type.startsWith("image/")) {
    ElMessage.error("只能上传图片文件")
    return false
  }

  if (acceptTypes.value.length && !acceptTypes.value.includes(file.type)) {
    ElMessage.error("图片格式不支持")
    return false
  }

  if (file.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  return true
}

async function handleUpload({ file }) {
  uploading.value = true
  try {
    const { data } = await uploadOssApi(file)
    const url = resolveUploadUrl(data)
    if (!url) {
      ElMessage.error("上传成功，但未获取到图片地址")
      return
    }
    model.value = url
    ElMessage.success("上传成功")
  } finally {
    uploading.value = false
  }
}

function handleRemove() {
  model.value = ""
}
</script>

<template>
  <div class="image-upload" :style="uploadStyle">
    <el-upload
      class="image-upload__uploader"
      :show-file-list="false"
      :disabled="disabled || uploading"
      :accept="accept"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
    >
      <div v-loading="uploading" class="image-upload__trigger">
        <img v-if="model" :src="model" alt="封面图" class="image-upload__image">
        <el-icon v-else class="image-upload__icon">
          <Plus />
        </el-icon>

        <button
          v-if="model && !disabled && !uploading"
          type="button"
          class="image-upload__remove"
          @click.stop="handleRemove"
        >
          <el-icon>
            <Close />
          </el-icon>
        </button>
      </div>
    </el-upload>

    <p v-if="tip" class="image-upload__tip">
      {{ tip }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.image-upload {
  &__uploader {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  &__trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--image-upload-width, 120px);
    height: var(--image-upload-height, 120px);
    background: var(--el-fill-color-lighter);
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__icon {
    font-size: 28px;
    color: var(--el-text-color-placeholder);
  }

  &__remove {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    color: #fff;
    cursor: pointer;
    background: rgb(0 0 0 / 45%);
    border: none;
    border-radius: 50%;

    &:hover {
      background: rgb(0 0 0 / 65%);
    }
  }

  &__tip {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--el-text-color-secondary);
  }
}
</style>
