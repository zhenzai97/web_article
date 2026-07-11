<script setup>
const props = defineProps({
  /** 选项源数据，如 YES_NO_OPTIONS */
  options: {
    type: Array,
    default: () => []
  },
  /** 当前值 */
  value: {
    type: [String, Number, Boolean],
    default: undefined
  },
  /** 未匹配时的占位文本 */
  emptyText: {
    type: String,
    default: "-"
  },
  /** 是否以 Tag 展示 */
  tag: {
    type: Boolean,
    default: true
  },
  /** Tag 尺寸 */
  size: {
    type: String,
    default: "small"
  },
  /** 未配置 tagType 时的默认 Tag 类型 */
  defaultTagType: {
    type: String,
    default: "info"
  }
})

const currentOption = computed(() => {
  if (props.value === undefined || props.value === null || props.value === "") {
    return null
  }
  return props.options.find(item => item.value === props.value) ?? null
})

const displayLabel = computed(() => currentOption.value?.label ?? props.emptyText)

const tagType = computed(() => currentOption.value?.tagType ?? props.defaultTagType)
</script>

<template>
  <el-tag
    v-if="tag && currentOption"
    :type="tagType"
    effect="plain"
    :size="size"
    disable-transitions
  >
    {{ displayLabel }}
  </el-tag>
  <span v-else-if="!tag && currentOption">{{ displayLabel }}</span>
  <span v-else>{{ emptyText }}</span>
</template>
