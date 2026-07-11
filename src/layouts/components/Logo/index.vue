<script setup>
import { useLayoutMode } from "@@/composables/useLayoutMode"
import { Document } from "@element-plus/icons-vue"

const { collapse = true } = defineProps({
  collapse: {
    type: Boolean,
    default: true
  }
})

const { isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse, 'layout-mode-top': isTop }">
    <router-link class="layout-logo-link" to="/">
      <span class="layout-logo-icon">
        <el-icon :size="collapse ? 20 : 18">
          <Document />
        </el-icon>
      </span>
      <span v-if="!collapse" class="layout-logo-text">
        <span class="logo-title">文章后台</span>
        <span class="logo-subtitle">Article CMS</span>
      </span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--v3-header-height);
  overflow: hidden;
}

.layout-mode-top {
  height: var(--v3-navigationbar-height);
}

.layout-logo-link {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }
}

.layout-logo-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgb(212 168 83 / 35%);
  border-radius: 8px;
  color: #d4a853;
  background: rgb(212 168 83 / 12%);
}

.layout-logo-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  line-height: 1.2;
  text-align: left;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.logo-subtitle {
  margin-top: 2px;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: rgb(255 255 255 / 45%);
  text-transform: uppercase;
  white-space: nowrap;
}

.collapse {
  .layout-logo-link {
    padding: 0;
  }

  .layout-logo-text {
    display: none;
  }
}
</style>
