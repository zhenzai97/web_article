import { request } from "@/http/axios"

/** 获取登录验证码 */
export function getCaptchaApi() {
  return request({
    url: "auth/captcha",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data) {
  return request({
    url: "user/login",
    method: "post",
    data
  })
}
