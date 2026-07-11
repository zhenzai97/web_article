import { ElLoading } from "element-plus"

const DEFAULT_OPTIONS = {
  lock: true,
  text: "加载中..."
}

export function useFullscreenLoading(fn, options = {}) {
  let loadingInstance
  return async (...args) => {
    try {
      loadingInstance = ElLoading.service({ ...DEFAULT_OPTIONS, ...options })
      return await fn(...args)
    } finally {
      loadingInstance.close()
    }
  }
}
