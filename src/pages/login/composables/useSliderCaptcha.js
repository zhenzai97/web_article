/**
 * tianai-captcha 滑块验证
 * @see https://doc.captcha.tianai.cloud/
 */
export function useSliderCaptcha() {
  const captchaVerifiedId = ref("")

  function ensureCaptchaReady() {
    if (typeof window.initTAC !== "function") {
      throw new Error("滑块验证组件加载失败，请刷新页面后重试")
    }
  }

  function openCaptcha() {
    ensureCaptchaReady()

    return new Promise((resolve, reject) => {
      const config = {
        requestCaptchaDataUrl: `${import.meta.env.VITE_BASE_URL}/captcha/gen`,
        validCaptchaUrl: `${import.meta.env.VITE_BASE_URL}/captcha/check`,
        bindEl: "#login-captcha-box",
        validSuccess: (res, _config, tac) => {
          captchaVerifiedId.value = res?.data?.id ?? res?.data ?? ""
          tac.destroyWindow()
          resolve(captchaVerifiedId.value)
        },
        validFail: (_res, _config, tac) => {
          ElMessage.warning("滑块验证失败，请重试")
          tac.reloadCaptcha()
        },
        btnCloseFun: (_el, tac) => {
          tac.destroyWindow()
          reject(new Error("已取消验证"))
        }
      }

      const style = {
        moveTrackMaskBgColor: "#00bdd2",
        moveTrackMaskBorderColor: "#00bdd2"
      }

      window.initTAC("/tac", config, style)
        .then(tac => tac.init())
        .catch((error) => {
          reject(error instanceof Error ? error : new Error("滑块验证初始化失败"))
        })
    })
  }

  function resetCaptcha() {
    captchaVerifiedId.value = ""
  }

  return {
    captchaVerifiedId,
    openCaptcha,
    resetCaptcha
  }
}
