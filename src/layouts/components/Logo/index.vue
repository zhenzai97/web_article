<script setup>
import logo from "@@/assets/images/brand/logo.png"
import { useLayoutMode } from "@@/composables/useLayoutMode"

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
      <img class="layout-logo-icon" :src="logo" alt="德宏州新媒体协会">
      <span v-if="!collapse" class="layout-logo-text">
        <span class="logo-title">德宏州新媒体协会</span>
        <span class="logo-subtitle">内容运营管理系统</span>
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
  padding: 0 12px;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }
}

.layout-logo-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 8px;
}

.layout-logo-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  line-height: 1.25;
  text-align: left;
}

.logo-title {
  max-width: 100%;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.logo-subtitle {
  margin-top: 2px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: rgb(255 255 255 / 50%);
  white-space: nowrap;
}

.collapse {
  .layout-logo-link {
    padding: 0;
  }

  .layout-logo-text {
    display: none;
  }

  .layout-logo-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
