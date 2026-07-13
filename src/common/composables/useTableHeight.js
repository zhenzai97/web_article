import { calcTableHeightByFlex, calcTableHeightByPosition, calcTableHeightInternal, findScrollContainer, getScrollableAncestors } from "@@/utils/calc-table-height"

/**
 * 使用表格高度计算的 Hook
 * @param {object} options - 配置选项
 * @param {"selector" | "position" | "flex"} [options.mode] - 计算模式
 * @param {string} [options.containerClass] - 最外层容器的 class 选择器
 * @param {HTMLElement | null} [options.containerEl] - 最外层容器元素
 * @param {string[]} [options.subtractClasses] - 要减去高度的元素 class 选择器数组
 * @param {HTMLElement[]} [options.subtractEls] - 要减去高度的元素数组
 * @param {HTMLElement | null} [options.tableEl] - 表格容器元素（position 模式）
 * @param {HTMLElement | null} [options.pagerEl] - 分页容器元素（position 模式）
 * @param {number} [options.offset] - 额外的偏移量
 * @param {number} [options.minHeight] - 最小高度
 * @param {number} [options.delay] - 延迟执行时间（毫秒），用于等待动画完成
 * @param {number} [options.debounceDelay] - debounce 延迟时间（毫秒）
 * @param {boolean} [options.autoInit] - 是否自动初始化
 * @returns {{ tableHeight: import("vue").Ref<number>, recalc: Function, init: Function, cleanup: Function }}
 */
export function useTableHeight(options = {}) {
  const {
    mode = "selector",
    containerClass,
    containerEl,
    subtractClasses = [],
    subtractEls = [],
    tableEl,
    pagerEl,
    offset = 0,
    minHeight = 600,
    delay = 0,
    debounceDelay = 200,
    autoInit = true
  } = options

  const tableHeight = ref(minHeight)
  let resizeTimeoutId = null
  let delayTimeoutId = null
  let resizeObserver = null
  /** @type {HTMLElement[]} */
  const scrollContainers = []

  function executeCalc() {
    nextTick(() => {
      const resolvedTableEl = typeof tableEl === "function" ? tableEl() : tableEl?.value ?? tableEl
      const height = mode === "flex"
        ? calcTableHeightByFlex({
            tableEl: resolvedTableEl,
            minHeight
          })
        : mode === "position"
          ? calcTableHeightByPosition({
              tableEl: resolvedTableEl,
              pagerEl: typeof pagerEl === "function" ? pagerEl() : pagerEl?.value ?? pagerEl,
              containerEl: typeof containerEl === "function" ? containerEl() : containerEl?.value ?? containerEl,
              offset,
              minHeight
            })
          : calcTableHeightInternal({
              containerClass,
              containerEl: typeof containerEl === "function" ? containerEl() : containerEl?.value ?? containerEl,
              subtractClasses,
              subtractEls: (typeof subtractEls === "function" ? subtractEls() : subtractEls)?.map?.(
                el => (el?.value ?? el)
              ) ?? [],
              offset,
              minHeight
            })

      if (height !== null) {
        tableHeight.value = height
      }
    })
  }

  function debouncedCalc() {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
    }
    resizeTimeoutId = setTimeout(() => {
      if (delay > 0) {
        if (delayTimeoutId) {
          clearTimeout(delayTimeoutId)
        }
        delayTimeoutId = setTimeout(executeCalc, delay)
      } else {
        executeCalc()
      }
    }, debounceDelay)
  }

  function handleResize() {
    debouncedCalc()
  }

  function recalc() {
    if (delay > 0) {
      if (delayTimeoutId) {
        clearTimeout(delayTimeoutId)
      }
      delayTimeoutId = setTimeout(executeCalc, delay)
    } else {
      executeCalc()
    }
  }

  function getTableElement() {
    return typeof tableEl === "function" ? tableEl() : tableEl?.value ?? tableEl
  }

  function getPagerElement() {
    return typeof pagerEl === "function" ? pagerEl() : pagerEl?.value ?? pagerEl
  }

  function getContainerElement() {
    return typeof containerEl === "function"
      ? containerEl()
      : containerEl?.value ?? containerEl ?? (containerClass ? document.querySelector(containerClass) : null)
  }

  function bindScrollListeners() {
    unbindScrollListeners()

    const tableElement = getTableElement()
    if (!tableElement) return

    getScrollableAncestors(tableElement).forEach((node) => {
      node.addEventListener("scroll", debouncedCalc, { passive: true })
      scrollContainers.push(node)
    })
  }

  function unbindScrollListeners() {
    scrollContainers.forEach(node => node.removeEventListener("scroll", debouncedCalc))
    scrollContainers.length = 0
  }

  function bindResizeObserver() {
    if (typeof ResizeObserver === "undefined") return

    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(debouncedCalc)

    const container = getContainerElement()
    if (container) {
      resizeObserver.observe(container)
    }

    const tableElement = getTableElement()
    if (tableElement) {
      resizeObserver.observe(tableElement)

      if (mode === "flex") {
        let node = tableElement.parentElement
        while (node && node !== document.body) {
          resizeObserver.observe(node)
          if (node.classList.contains("page-layout")) {
            break
          }
          node = node.parentElement
        }
      } else {
        const pageLayout = tableElement.closest(".page-layout")
        if (pageLayout) {
          resizeObserver.observe(pageLayout)
        }

        const scrollContainer = findScrollContainer(tableElement)
        if (scrollContainer) {
          resizeObserver.observe(scrollContainer)
        }
      }
    }

    const pagerElement = getPagerElement()
    if (pagerElement) {
      resizeObserver.observe(pagerElement)
    }

    subtractClasses.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        resizeObserver.observe(el)
      })
    })
  }

  function cleanup() {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
    }
    if (delayTimeoutId) {
      clearTimeout(delayTimeoutId)
    }
    resizeObserver?.disconnect()
    resizeObserver = null
    unbindScrollListeners()
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize)
    }
  }

  function init() {
    if (delay > 0) {
      delayTimeoutId = setTimeout(executeCalc, delay)
    } else {
      executeCalc()
    }
    bindResizeObserver()
    if (mode !== "flex") {
      bindScrollListeners()
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
    }
  }

  function refreshOnActivate() {
    nextTick(() => {
      requestAnimationFrame(() => {
        bindResizeObserver()
        executeCalc()
      })
    })
  }

  if (autoInit) {
    onMounted(() => {
      init()
    })

    onActivated(refreshOnActivate)

    onBeforeUnmount(() => {
      cleanup()
    })
  }

  return {
    tableHeight,
    recalc,
    init,
    cleanup
  }
}
