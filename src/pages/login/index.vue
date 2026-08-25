<script setup>
import { loginApi } from "@@/apis/auth"
import logo from "@@/assets/images/brand/logo.png"
import goldenPagodaCover from "@@/assets/images/login/微信图片_20260825165512_87_15.jpg"
import silverPagodaCover from "@@/assets/images/login/微信图片_20260825165656_91_15.png"
import ThemeSwitch from "@@/components/ThemeSwitch/index.vue"
import { Lock, User } from "@element-plus/icons-vue"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useUserStore } from "@/pinia/stores/user"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const loginFormRef = useTemplateRef("loginFormRef")
const loading = ref(false)

const coverSlides = [
  { src: goldenPagodaCover, position: "50% 22%" },
  { src: silverPagodaCover, position: "50% 28%" }
]
const activeCoverIndex = ref(0)
let coverTimer = null

onMounted(() => {
  coverTimer = window.setInterval(() => {
    activeCoverIndex.value = (activeCoverIndex.value + 1) % coverSlides.length
  }, 6000)
})

onUnmounted(() => {
  if (coverTimer !== null) {
    window.clearInterval(coverTimer)
  }
})

const loginFormData = reactive({
  userAccount: "admin",
  userPassword: "12345678"
})

const loginFormRules = {
  userAccount: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ]
}

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
    <aside class="login-cover" aria-label="品牌介绍">
      <img
        v-for="(slide, index) in coverSlides"
        :key="index"
        class="login-cover__img"
        :class="{ 'login-cover__img--active': activeCoverIndex === index }"
        :src="slide.src"
        alt=""
        :style="{ objectPosition: slide.position }"
      >
      <div class="login-cover__mask" />
      <div class="login-cover__content">
        <h1 class="login-cover__title">
          德宏州新媒体协会
        </h1>
        <p class="login-cover__subtitle">
          内容运营管理系统
        </p>
        <p class="login-cover__tagline">
          让内容发布更便捷、运营更高效
        </p>
      </div>
      <p class="login-cover__copyright">
        © 德宏州新媒体协会
      </p>
    </aside>

    <main class="login-main">
      <ThemeSwitch v-if="settingsStore.showThemeSwitch" class="theme-switch" />

      <div class="login-form-panel">
        <header class="login-brand">
          <img class="login-brand__logo" :src="logo" alt="德宏州新媒体协会">
          <div class="login-brand__text">
            <h2>德宏州新媒体协会</h2>
            <p>内容运营管理系统</p>
          </div>
        </header>

        <div class="login-section">
          <h3 class="login-section__title">
            账号登录
          </h3>
          <div class="login-section__line" />

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
                placeholder="请输入用户名"
                type="text"
                tabindex="1"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="userPassword">
              <el-input
                v-model.trim="loginFormData.userPassword"
                placeholder="请输入密码"
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
              登录
            </el-button>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  --brand-primary: #00bdd2;
  --brand-dark: #000835;

  display: flex;
  min-height: 100vh;
  background: #fff;
}

.login-cover {
  position: relative;
  flex: 0 0 38%;
  min-height: 100vh;
  overflow: hidden;
  color: #fff;

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.6s ease;

    &--active {
      opacity: 1;
    }
  }

  &__mask {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgb(0 8 53 / 72%) 0%, rgb(0 8 53 / 38%) 50%, rgb(0 8 53 / 14%) 100%),
      linear-gradient(180deg, rgb(0 8 53 / 48%) 0%, transparent 35%, rgb(0 8 53 / 58%) 100%);
  }

  &__content {
    position: relative;
    z-index: 1;
    padding: 56px 48px 0;
  }

  &__title {
    margin: 0 0 12px;
    font-size: clamp(1.75rem, 2.8vw, 2.25rem);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.04em;
  }

  &__subtitle {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 500;
    color: rgb(255 255 255 / 92%);
  }

  &__tagline {
    margin: 0;
    max-width: 320px;
    font-size: 14px;
    line-height: 1.7;
    color: rgb(255 255 255 / 72%);
  }

  &__copyright {
    position: absolute;
    right: 48px;
    bottom: 32px;
    left: 48px;
    z-index: 1;
    margin: 0;
    font-size: 12px;
    color: rgb(255 255 255 / 55%);
  }
}

.login-main {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: #fff;
}

.theme-switch {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 2;
  cursor: pointer;
}

.login-form-panel {
  width: min(420px, 100%);
}

.login-brand {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 48px;

  &__logo {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }

  &__text {
    h2 {
      margin: 0 0 4px;
      font-size: 22px;
      font-weight: 700;
      color: var(--brand-dark);
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #909399;
    }
  }
}

.login-section {
  &__title {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: var(--brand-primary);
  }

  &__line {
    height: 1px;
    margin-bottom: 28px;
    background: #ebeef5;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }

  :deep(.el-input__wrapper) {
    padding: 6px 14px;
    border-radius: 6px;
    box-shadow: 0 0 0 1px #dcdfe6 inset;
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--brand-primary) inset;
  }
}

.login-btn {
  width: 100%;
  height: 44px;
  margin-top: 12px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.08em;
  background: var(--brand-primary);

  &:hover,
  &:focus {
    background: #26d1e4;
  }
}

@media (width <= 960px) {
  .login-page {
    flex-direction: column;
  }

  .login-cover {
    flex: none;
    min-height: 280px;

    &__content {
      padding: 36px 28px 0;
    }

    &__tagline {
      display: none;
    }

    &__copyright {
      right: 28px;
      bottom: 20px;
      left: 28px;
    }
  }

  .login-main {
    padding: 36px 24px 48px;
  }

  .login-brand {
    margin-bottom: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-cover__img {
    transition: none;
  }
}

html.dark {
  .login-main {
    background: #141414;
  }

  .login-brand__text h2 {
    color: var(--el-text-color-primary);
  }

  .login-section__line {
    background: #303030;
  }

  .login-form :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #434343 inset;
  }
}
</style>
