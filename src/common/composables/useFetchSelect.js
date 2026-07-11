/** Select 需要的数据格式 */

/** 接口响应格式 */
/** 入参格式，暂时只需要传递 api 函数即可 */

/** 下拉选择器 Composable */
export function useFetchSelect(props) {
  const { api } = props

  const loading = ref(false)

  const options = ref([])

  const value = ref("")

  // 调用接口获取数据
  const loadData = () => {
    loading.value = true
    options.value = []
    api().then((res) => {
      options.value = res.data
    }).finally(() => {
      loading.value = false
    })
  }

  onMounted(() => {
    loadData()
  })

  return { loading, options, value }
}
