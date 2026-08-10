<script setup>
import { Loading } from "@element-plus/icons-vue"
import { debounce } from "lodash-es"

defineOptions({
  name: "RemoteSelect"
})

const LOAD_MORE_VALUE = "__remote_select_loadmore__"

const props = defineProps({
  /** 分页接口：(params) => Promise<{ data: { records, total } }> */
  api: {
    type: Function,
    required: true
  },
  /** 选项 value 字段 */
  valueField: {
    type: String,
    default: "id"
  },
  /** 选项 label 字段 */
  labelField: {
    type: String,
    default: "name"
  },
  /** 关键字查询参数名 */
  keywordField: {
    type: String,
    default: "keyword"
  },
  /** 每页条数 */
  pageSize: {
    type: Number,
    default: 10
  },
  /** 额外固定查询参数 */
  params: {
    type: Object,
    default: () => ({})
  },
  /** 是否开启滚动加载 */
  scrollLoading: {
    type: Boolean,
    default: true
  },
  /** 是否开启远程关键字搜索 */
  remoteSearch: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: "请选择"
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 回显用：当前选中项不在已加载 options 中时补一条
   * 如 { id, name }
   */
  notMatchData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["change", "data-change"])

const model = defineModel({ default: undefined })

const options = ref([])
const loading = ref(false)
const initLoading = ref(false)
/** idle | loading | done | complete */
const scrollStatus = ref("idle")
const current = ref(1)
const total = ref(0)
const searchValue = ref("")
const selectRef = useTemplateRef("selectRef")
const sentinelRef = useTemplateRef("sentinelRef")

let requestSeq = 0
let observer = null

const hasMore = computed(() => options.value.length < total.value)

function getItemValue(item) {
  return item?.[props.valueField]
}

function getItemLabel(item) {
  return item?.[props.labelField]
}

function buildParams(page) {
  return {
    current: page,
    pageSize: props.pageSize,
    ...props.params,
    [props.keywordField]: searchValue.value || undefined
  }
}

/** 把不在列表中的选中项插入，保证能回显 label */
function applyNotMatchData() {
  const data = props.notMatchData
  if (!data || model.value === undefined || model.value === null || model.value === "") {
    return
  }
  const matched = options.value.some(item => getItemValue(item) === model.value)
  if (matched) return
  const insertValue = getItemValue(data)
  if (insertValue === undefined || insertValue === null) return
  const already = options.value.some(item => getItemValue(item) === insertValue)
  if (!already) {
    options.value.unshift({ ...data })
  }
}

async function fetchList({ page = 1, append = false } = {}) {
  if (!props.api) return []
  const seq = ++requestSeq
  try {
    const { data } = await props.api(buildParams(page))
    if (seq !== requestSeq) return []
    const records = data?.records || []
    total.value = Number(data?.total ?? 0)
    current.value = page
    if (append) {
      if (!records.length) {
        total.value = options.value.length
      } else {
        const exists = new Set(options.value.map(getItemValue))
        records.forEach((row) => {
          const val = getItemValue(row)
          if (val !== undefined && val !== null && !exists.has(val)) {
            options.value.push(row)
            exists.add(val)
          }
        })
      }
    } else {
      options.value = records
      applyNotMatchData()
    }
    emit("data-change", options.value)
    return records
  } catch {
    if (seq !== requestSeq) return []
    if (!append) {
      options.value = []
      total.value = 0
    }
    return []
  } finally {
    if (seq === requestSeq) {
      nextTick(() => setupObserver())
    }
  }
}

async function getRemoteData({ append = false } = {}) {
  if (append) {
    if (!props.scrollLoading || scrollStatus.value === "loading" || !hasMore.value) {
      return
    }
    scrollStatus.value = "loading"
    try {
      await fetchList({ page: current.value + 1, append: true })
      scrollStatus.value = hasMore.value ? "done" : "complete"
    } catch {
      scrollStatus.value = "done"
    }
    return
  }

  loading.value = true
  scrollStatus.value = "idle"
  try {
    await fetchList({ page: 1, append: false })
    scrollStatus.value = hasMore.value ? "done" : "complete"
  } finally {
    loading.value = false
    initLoading.value = false
  }
}

async function onScrollLoadMore() {
  if (!props.scrollLoading) return
  if (options.value.length < total.value) {
    await getRemoteData({ append: true })
  } else {
    scrollStatus.value = "complete"
  }
}

const onRemoteSearch = debounce((value) => {
  if (searchValue.value === value) return
  searchValue.value = value ?? ""
  getRemoteData({ append: false })
}, 500)

function handleFilterMethod(value) {
  if (!props.remoteSearch) return
  onRemoteSearch(value)
}

function handleVisibleChange(visible) {
  if (visible && !options.value.length && props.api) {
    getRemoteData({ append: false })
  }
  if (visible) {
    nextTick(() => setupObserver())
  } else {
    teardownObserver()
  }
}

function handleChange(val) {
  const item = options.value.find(row => getItemValue(row) === val)
  emit("change", val, item)
}

function setupObserver() {
  teardownObserver()
  if (!props.scrollLoading) return
  const el = sentinelRef.value
  if (!el) return
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry?.isIntersecting) return
    onScrollLoadMore()
  }, {
    root: el.closest(".el-select-dropdown__wrap") || el.closest(".el-scrollbar__wrap") || null,
    rootMargin: "0px 0px 16px 0px",
    threshold: 0
  })
  observer.observe(el)
}

function teardownObserver() {
  observer?.disconnect()
  observer = null
}

watch(
  () => model.value,
  async (val) => {
    const hasValue = Array.isArray(val) ? val.length > 0 : (val !== undefined && val !== null && val !== "")
    if (!hasValue || options.value.length) {
      applyNotMatchData()
      return
    }
    initLoading.value = true
    await getRemoteData({ append: false })
  },
  { immediate: true }
)

watch(
  () => props.notMatchData,
  () => applyNotMatchData(),
  { deep: true }
)

onBeforeUnmount(() => {
  onRemoteSearch.cancel()
  teardownObserver()
})

defineExpose({
  reload: () => getRemoteData({ append: false }),
  options,
  selectRef
})
</script>

<template>
  <div class="remote-select">
    <div v-if="initLoading" class="remote-select__mask">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>
    <el-select
      ref="selectRef"
      v-model="model"
      filterable
      remote-show-suffix
      :clearable="clearable"
      :disabled="disabled"
      :loading="loading"
      :placeholder="placeholder"
      :filter-method="remoteSearch ? handleFilterMethod : undefined"
      fit-input-width
      class="remote-select__inner"
      @visible-change="handleVisibleChange"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="String(getItemValue(item))"
        :label="getItemLabel(item)"
        :value="getItemValue(item)"
        :disabled="item.disabled"
      />

      <!-- 滚动加载哨兵：进入可视区后拉下一页 -->
      <el-option
        v-if="scrollLoading && (hasMore || scrollStatus === 'loading')"
        :value="LOAD_MORE_VALUE"
        disabled
        class="remote-select__loadmore-option"
      >
        <div ref="sentinelRef" class="remote-select__sentinel" @click.stop>
          <template v-if="scrollStatus === 'loading'">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
            <span>数据加载中</span>
          </template>
          <span v-else class="remote-select__sentinel-placeholder">&nbsp;</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.remote-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.remote-select__inner {
  width: 100%;
}

.remote-select__mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 10px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
}

.remote-select__sentinel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 20px;
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  pointer-events: none;
}

.remote-select__sentinel-placeholder {
  display: block;
  height: 1px;
}
</style>

<style lang="scss">
.remote-select__loadmore-option {
  cursor: default !important;

  &.is-disabled {
    cursor: default !important;
  }

  .el-select-dropdown__item {
    pointer-events: none;
  }
}
</style>
