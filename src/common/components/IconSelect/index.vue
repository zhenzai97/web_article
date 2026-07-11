<script setup>
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { Search } from "@element-plus/icons-vue"

const model = defineModel({ default: "" })

const dialogVisible = ref(false)
const keyword = ref("")

const iconNames = Object.keys(ElementPlusIconsVue)

const filteredIcons = computed(() => {
  if (!keyword.value.trim()) {
    return iconNames
  }
  const searchKey = keyword.value.trim().toLowerCase()
  return iconNames.filter(name => name.toLowerCase().includes(searchKey))
})

const selectedIconComponent = computed(() => getIconComponent(model.value))

function getIconComponent(name) {
  if (!name || !(name in ElementPlusIconsVue)) {
    return null
  }
  return ElementPlusIconsVue[name]
}

function openDialog() {
  keyword.value = ""
  dialogVisible.value = true
}

function selectIcon(name) {
  model.value = name
  dialogVisible.value = false
}

function clearIcon() {
  model.value = ""
}
</script>

<template>
  <div class="icon-select">
    <div class="icon-select-trigger" :class="{ 'is-empty': !model }" @click="openDialog">
      <component :is="selectedIconComponent" v-if="selectedIconComponent" class="selected-icon" />
      <span v-if="model" class="icon-name">{{ model }}</span>
      <span v-else class="placeholder">请选择图标</span>
    </div>
    <span v-if="model" class="clear-btn" @click="clearIcon">清除</span>

    <el-dialog v-model="dialogVisible" title="选择图标" width="480px" append-to-body destroy-on-close>
      <el-input v-model="keyword" placeholder="搜索图标" clearable :prefix-icon="Search" />
      <el-scrollbar max-height="360px" class="icon-scrollbar">
        <div class="icon-grid">
          <div
            v-for="name in filteredIcons"
            :key="name"
            class="icon-item"
            :class="{ 'is-active': model === name }"
            :title="name"
            @click="selectIcon(name)"
          >
            <component :is="getIconComponent(name)" v-if="getIconComponent(name)" />
          </div>
        </div>
        <el-empty v-if="!filteredIcons.length" description="未找到匹配图标" :image-size="60" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.icon-select {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.icon-select-trigger {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.is-empty {
    color: var(--el-text-color-placeholder);
  }

  .selected-icon {
    width: 16px;
    height: 16px;
  }

  .icon-name {
    flex: 1;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  .placeholder {
    flex: 1;
    font-size: 14px;
  }
}

.clear-btn {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--el-color-danger);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.icon-scrollbar {
  margin-top: 12px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  padding: 4px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-5);
    background-color: var(--el-color-primary-light-9);
  }

  &.is-active {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
