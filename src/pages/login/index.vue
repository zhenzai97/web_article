<script setup>
import { loginApi } from "@@/apis/auth"
import ThemeSwitch from "@@/components/ThemeSwitch/index.vue"
import { Document, Lock, User } from "@element-plus/icons-vue"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useUserStore } from "@/pinia/stores/user"

const route = useRoute()

const router = useRouter()

const userStore = useUserStore()

const settingsStore = useSettingsStore()

/** 登录表单元素的引用 */
const loginFormRef = useTemplateRef("loginFormRef")

/** 登录按钮 Loading */
const loading = ref(false)

/** 登录表单数据 */
const loginFormData = reactive({
  userAccount: "admin",
  userPassword: "12345678"
})

/** 登录表单校验规则 */
const loginFormRules = {
  userAccount: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ]
}

/** 登录 */
function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    loginApi(loginFormData).then(({ data }) => {
      userStore.setToken(data.token)
      router.push(route.query.redirect ? decodeURIComponent(route.query.redirect) : "/")
    }).catch(() => {
      loginFormData.userPassword = ""
    }).finally(() => {
      loading.value = false
    })
  })
}
</script>

<template>
  <div class="login-page">
    <ThemeSwitch v-if="settingsStore.showThemeSwitch" class="theme-switch" />

    <section class="login-brand" aria-label="品牌介绍">
      <div class="brand-inner">
        <div class="brand-logo">
          <el-icon :size="28">
            <Document />
          </el-icon>
        </div>
        <h1 class="brand-title">
          文章管理后台
        </h1>
        <p class="brand-desc">
          内容创作、编辑发布与权限管理，一站完成
        </p>
        <ul class="brand-list">
          <li>富文本撰写与草稿管理</li>
          <li>分类标签与文章归档</li>
          <li>多角色协作与发布审核</li>
        </ul>
      </div>
      <div class="brand-papers" aria-hidden="true">
        <span /><span /><span />
      </div>
    </section>

    <section class="login-panel">
      <div class="login-card">
        <header class="login-header">
          <h2>欢迎回来</h2>
          <p>登录以继续管理你的文章内容</p>
        </header>

        <el-form
          ref="loginFormRef"
          class="login-form"
          :model="loginFormData"
          :rules="loginFormRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="userAccount">
            <el-input
              v-model.trim="loginFormData.userAccount"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="userPassword">
            <el-input
              v-model.trim="loginFormData.userPassword"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button
            class="login-btn"
            :loading="loading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
          >
            登 录
          </el-button>
        </el-form>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&display=swap");

.login-page {
  --brand-bg: #111827;
  --brand-accent: #d4a853;
  --brand-text: #f3f4f6;
  --brand-muted: rgb(243 244 246 / 65%);
  --panel-bg: #f6f4ef;
  --card-bg: #fff;
  --card-border: rgb(17 24 39 / 8%);

  display: flex;
  min-height: 100vh;
  background: var(--panel-bg);

  .theme-switch {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 10;
    cursor: pointer;
  }
}

.login-brand {
  position: relative;
  display: flex;
  flex: 1.1;
  align-items: center;
  justify-content: center;
  padding: 48px;
  overflow: hidden;
  color: var(--brand-text);
  background:
    radial-gradient(ellipse 80% 60% at 20% 100%, rgb(212 168 83 / 18%), transparent 60%),
    linear-gradient(145deg, #0b1220 0%, var(--brand-bg) 45%, #1e293b 100%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgb(255 255 255 / 3%) 1px, transparent 1px),
      linear-gradient(90deg, rgb(255 255 255 / 3%) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, rgb(0 0 0 / 60%), transparent);
    pointer-events: none;
  }
}

.brand-inner {
  position: relative;
  z-index: 1;
  max-width: 420px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 28px;
  border: 1px solid rgb(212 168 83 / 35%);
  border-radius: 14px;
  color: var(--brand-accent);
  background: rgb(212 168 83 / 10%);
}

.brand-title {
  margin: 0 0 16px;
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.04em;
}

.brand-desc {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--brand-muted);
}

.brand-list {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 18px;
    font-size: 14px;
    line-height: 2;
    color: var(--brand-muted);

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--brand-accent);
      transform: translateY(-50%);
    }
  }
}

.brand-papers {
  position: absolute;
  right: 8%;
  bottom: 12%;
  width: 180px;
  height: 220px;
  pointer-events: none;

  span {
    position: absolute;
    display: block;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 4px;
    background: rgb(255 255 255 / 4%);

    &:nth-child(1) {
      inset: 0;
      transform: rotate(-6deg);
    }

    &:nth-child(2) {
      inset: 12px 8px 8px 12px;
      transform: rotate(3deg);
      background: rgb(255 255 255 / 6%);
    }

    &:nth-child(3) {
      inset: 24px 16px 16px 24px;
      transform: rotate(-2deg);
      background: rgb(212 168 83 / 8%);
    }
  }
}

.login-panel {
  display: flex;
  flex: 0.9;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 36px 36px;
  border: 1px solid var(--card-border);
  border-radius: 16px;
  background: var(--card-bg);
  box-shadow:
    0 1px 2px rgb(17 24 39 / 4%),
    0 12px 40px rgb(17 24 39 / 8%);
}

.login-header {
  margin-bottom: 32px;

  h2 {
    margin: 0 0 8px;
    font-size: 26px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 4px 12px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }
}

.login-btn {
  width: 100%;
  margin-top: 8px;
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
}

@media (width <= 900px) {
  .login-page {
    flex-direction: column;
  }

  .login-brand {
    flex: none;
    min-height: 280px;
    padding: 40px 32px 48px;
  }

  .brand-papers {
    display: none;
  }

  .brand-list {
    display: none;
  }

  .login-panel {
    flex: 1;
    margin-top: -24px;
  }

  .login-card {
    box-shadow: 0 -4px 24px rgb(17 24 39 / 6%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-papers span {
    transform: none !important;
  }
}

html.dark {
  .login-page {
    --panel-bg: #0f1117;
    --card-bg: #161b22;
    --card-border: rgb(255 255 255 / 8%);
  }
}
</style>
