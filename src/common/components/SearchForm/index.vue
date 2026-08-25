<script setup>
import { PAGE_LAYOUT_KEY } from "@@/composables/usePageLayout"
import { resetDateRangeFields } from "@@/utils/sanitize-search-params"
import { ArrowUp, Refresh, Search, Setting } from "@element-plus/icons-vue"
import FilterConfigDialog from "./components/FilterConfigDialog.vue"
import { useFilterLayout } from "./composables/useFilterLayout"
import { getFilterDefaultSpan, getFilterFormProp, resolveFilter } from "./filters"

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  /** 设置后才会缓存筛选项布局到 localStorage */
  cacheKey: {
    type: String,
    default: ""
  },
  /** 是否显示筛选项配置入口 */
  configurable: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: [String, Number],
    default: "auto"
  },
  defaultSpan: {
    type: Number,
    default: 8
  },
  gutter: {
    type: Number,
    default: 16
  },
  actionSpan: {
    type: Number,
    default: 8
  },
  /** 查询/重置按钮 loading */
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["search", "reset"])

const model = defineModel({ required: true })

provide("searchFormModel", model)

const formRef = useTemplateRef("formRef")

const configVisible = ref(false)

const pageLayout = inject(PAGE_LAYOUT_KEY, null)

const { layout, visibleItems, applyLayout } = useFilterLayout(
  () => props.items,
  () => props.cacheKey
)

function getSpan(item) {
  return item.span ?? getFilterDefaultSpan(item.component) ?? props.defaultSpan
}

function handleSearch() {
  emit("search")
}

function handleReset() {
  resetDateRangeFields(model.value, props.items)
  formRef.value?.resetFields()
  emit("reset")
}

function handleCollapse() {
  pageLayout?.collapseSearch?.()
}

function handleConfigSave(nextLayout) {
  applyLayout(nextLayout)
}

defineExpose({ reset: handleReset })
</script>

<template>
  <el-form ref="formRef" :model="model" :label-width="labelWidth">
    <el-row :gutter="gutter">
      <el-col v-for="item in visibleItems" :key="item.value" :span="getSpan(item)">
        <el-form-item :label="item.label" :prop="getFilterFormProp(item)">
          <component
            :is="resolveFilter(item.component).component"
            :item="item"
          />
        </el-form-item>
      </el-col>
      <el-col :span="actionSpan">
        <el-form-item label-width="0">
          <el-button type="primary" :icon="Search" :loading="loading" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" :loading="loading" @click="handleReset">
            重置
          </el-button>
          <el-button
            v-if="pageLayout?.collapseSearch"
            :icon="ArrowUp"
            title="收起筛选"
            @click="handleCollapse"
          >
            收起
          </el-button>
          <el-button
            v-if="configurable"
            :icon="Setting"
            title="筛选项配置"
            @click="configVisible = true"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <FilterConfigDialog
    v-if="configurable"
    v-model:visible="configVisible"
    :items="items"
    :layout="layout"
    @save="handleConfigSave"
  />
</template>

<style lang="scss" scoped>
:deep(.search-filter-full) {
  width: 100%;
}
</style>
