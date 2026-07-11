<script setup>
import { Rank } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import { VueDraggable } from "vue-draggable-plus"
import { createDefaultFilterLayout } from "../utils/filter-layout"

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  layout: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["save"])

const visible = defineModel("visible", { type: Boolean, default: false })

const draftLayout = ref([])

const labelMap = computed(() => {
  return new Map(props.items.map(item => [item.value, item.label]))
})

watch(visible, (show) => {
  if (show) {
    draftLayout.value = cloneDeep(props.layout)
  }
})

function getLabel(key) {
  return labelMap.value.get(key) ?? key
}

function handleRestoreDefault() {
  draftLayout.value = createDefaultFilterLayout(props.items)
}

function handleCancel() {
  visible.value = false
}

function handleSave() {
  emit("save", cloneDeep(draftLayout.value))
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="筛选项配置"
    width="720px"
    append-to-body
    destroy-on-close
    class="filter-config-dialog"
  >
    <p class="filter-config-tip">
      勾选显示筛选项，拖拽卡片可调整顺序
    </p>
    <VueDraggable
      v-model="draftLayout"
      class="filter-config-grid"
      :animation="200"
      ghost-class="filter-config-item--ghost"
      chosen-class="filter-config-item--chosen"
      drag-class="filter-config-item--drag"
      handle=".filter-config-item__handle"
      filter=".el-checkbox"
      :prevent-on-filter="true"
    >
      <div
        v-for="entry in draftLayout"
        :key="entry.key"
        class="filter-config-item"
        :class="{ 'is-active': entry.visible }"
      >
        <el-icon class="filter-config-item__handle" :size="14">
          <Rank />
        </el-icon>
        <el-checkbox v-model="entry.visible">
          {{ getLabel(entry.key) }}
        </el-checkbox>
      </div>
    </VueDraggable>

    <template #footer>
      <el-button @click="handleRestoreDefault">
        恢复默认
      </el-button>
      <el-button @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.filter-config-tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.filter-config-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-height: 420px;
  overflow-x: hidden;
  overflow-y: auto;
}

.filter-config-item {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: var(--el-color-primary-light-5);
  }

  &.is-active {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);

    :deep(.el-checkbox__label) {
      color: var(--el-color-primary);
    }
  }

  &__handle {
    flex-shrink: 0;
    color: var(--el-text-color-placeholder);
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  :deep(.el-checkbox) {
    flex: 1;
    min-width: 0;
    height: auto;
  }

  :deep(.el-checkbox__label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.filter-config-item--ghost {
  border: 1px dashed var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  opacity: 0.55;
}

.filter-config-item--chosen {
  box-shadow: var(--el-box-shadow);
}

.filter-config-item--drag {
  cursor: grabbing;
  opacity: 0.92;
}
</style>
