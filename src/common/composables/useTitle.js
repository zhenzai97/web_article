/** 椤圭洰鏍囬 */
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "V3 Admin Vite"

/** 鍔ㄦ€佹爣棰? */
const dynamicTitle = ref("")

/** 璁剧疆鏍囬 */
function setTitle(title) {
  dynamicTitle.value = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE
}

// 鐩戝惉鏍囬鍙樺寲
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

/** 鏍囬 Composable */
export function useTitle() {
  return { setTitle }
}
