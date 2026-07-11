/** 默认的分页参数 */
const DEFAULT_PAGINATION_DATA = {
  total: 0,
  current: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

/** 分页 Composable */
export function usePagination(initPaginationData) {
  // 合并分页参数
  const paginationData = reactive({ ...DEFAULT_PAGINATION_DATA, ...initPaginationData })

  // 改变当前页码
  const handleCurrentChange = (value) => {
    paginationData.current = value
  }

  // 改变每页显示条数
  const handleSizeChange = (value) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
