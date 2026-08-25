import { request } from "@/http/axios"

/** 登录并返回 Token（需先完成滑块验证，传 captchaId） */
export function loginApi(data) {
  return request({
    url: "user/login",
    method: "post",
    data
  })
}
