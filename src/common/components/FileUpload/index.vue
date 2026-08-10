<script setup>
import { resolveUploadUrl, uploadOssApi } from "@@/apis/upload"

const props = defineProps({
  /** 最大文件大小（MB） */
  maxSize: {
    type: Number,
    default: 50
  },
  /** 接受的文件类型 */
  accept: {
    type: String,
    default: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt,.mp4,.jpg,.jpeg,.png,.gif,.webp"
  },
  /** 最多上传数量 */
  limit: {
    type: Number,
    default: 1
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 提示文案 */
  tip: {
    type: String,
    default: "支持 PDF / Office / 图片 / 压缩包等，单个文件不超过 50MB"
  }
})

/**
 * limit===1：string URL
 * limit>1：string[] URL 列表
 */
const model = defineModel({
  type: [String, Array],
  default: ""
})

const isMultiple = computed(() => props.limit > 1)

const uploading = ref(false)
const fileList = ref([])

function getFileName(url) {
  if (!url) return "附件"
  try {
    const path = String(url).split("?")[0]
    const name = decodeURIComponent(path.substring(path.lastIndexOf("/") + 1))
    return name || "附件"
  } catch {
    return "附件"
  }
}

function normalizeUrls(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return [value].filter(Boolean)
}

function urlsEqual(a, b) {
  const left = normalizeUrls(a)
  const right = normalizeUrls(b)
  if (left.length !== right.length) return false
  return left.every((item, index) => item === right[index])
}

function syncFileListFromModel(value) {
  const urls = normalizeUrls(value)
  fileList.value = urls.map(url => ({
    name: getFileName(url),
    url,
    status: "success"
  }))
}

function writeModel(urls) {
  if (isMultiple.value) {
    model.value = [...urls]
  } else {
    model.value = urls[0] || ""
  }
}

watch(() => model.value, (value) => {
  const current = fileList.value.map(item => item.url).filter(Boolean)
  if (urlsEqual(current, value)) return
  syncFileListFromModel(value)
}, { immediate: true, deep: true })

function beforeUpload(file) {
  if (file.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
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
      ElMessage.error("上传成功，但未获取到文件地址")
      return
    }
    const next = isMultiple.value
      ? [...normalizeUrls(model.value), url]
      : [url]
    writeModel(next)
    syncFileListFromModel(next)
    ElMessage.success("上传成功")
  } finally {
    uploading.value = false
  }
}

function handleRemove(uploadFile) {
  const removeUrl = uploadFile.url || resolveUploadUrl(uploadFile.response)
  const next = normalizeUrls(model.value).filter(url => url !== removeUrl)
  writeModel(next)
  syncFileListFromModel(next)
}

function handlePreview(uploadFile) {
  const url = uploadFile.url || resolveUploadUrl(uploadFile.response)
  if (url) {
    window.open(url, "_blank")
  }
}

function handleExceed() {
  ElMessage.warning(`最多上传 ${props.limit} 个文件，请先移除已有文件`)
}
</script>

<template>
  <div class="file-upload">
    <el-upload
      v-model:file-list="fileList"
      :disabled="disabled || uploading"
      :accept="accept"
      :limit="limit"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :multiple="isMultiple"
    >
      <el-button type="primary" :loading="uploading" :disabled="disabled">
        点击上传
      </el-button>
      <template #tip>
        <div v-if="tip" class="el-upload__tip">
          {{ tip }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.file-upload {
  width: 100%;

  :deep(.el-upload-list) {
    margin-top: 8px;
  }
}
</style>
