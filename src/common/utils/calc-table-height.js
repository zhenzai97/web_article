/**
 * 获取元素占用高度（含上下 margin）
 * @param {HTMLElement | null | undefined} el
 */
export function getOuterHeight(el) {
  if (!el) return 0
  const style = getComputedStyle(el)
  return el.offsetHeight + Number.parseFloat(style.marginTop) + Number.parseFloat(style.marginBottom)
}

/**
 * 查找元素的所有可滚动祖先
 * @param {HTMLElement | null | undefined} el
 */
export function getScrollableAncestors(el) {
  /** @type {HTMLElement[]} */
  const ancestors = []
  let node = el?.parentElement

  while (node && node !== document.body) {
    const { overflowY } = getComputedStyle(node)
    if (["auto", "scroll", "overlay"].includes(overflowY)) {
      ancestors.push(node)
    }
    node = node.parentElement
  }

  return ancestors
}

/**
 * 查找元素的可滚动祖先
 * @param {HTMLElement | null | undefined} el
 */
export function findScrollContainer(el) {
  return getScrollableAncestors(el)[0] ?? null
}

/**
 * 根据容器与需扣减区域计算表格高度
 * @param {object} options
 * @param {string} [options.containerClass]
 * @param {HTMLElement | null} [options.containerEl]
 * @param {string[]} [options.subtractClasses]
 * @param {HTMLElement[]} [options.subtractEls]
 * @param {number} [options.offset]
 * @param {number} [options.minHeight]
 */
export function calcTableHeightInternal(options = {}) {
  const {
    containerClass,
    containerEl,
    subtractClasses = [],
    subtractEls = [],
    offset = 0,
    minHeight = 600
  } = options

  const container = containerEl ?? (containerClass ? document.querySelector(containerClass) : null)
  if (!container) return null

  let subtractHeight = 0

  subtractClasses.forEach((selector) => {
    const el = container.querySelector(selector) ?? document.querySelector(selector)
    subtractHeight += getOuterHeight(el)
  })

  subtractEls.forEach((el) => {
    subtractHeight += getOuterHeight(el)
  })

  const height = container.clientHeight - subtractHeight - offset
  return Math.max(height, minHeight)
}

/**
 * 基于表格位置计算可用高度（更适合 TableList 场景）
 * @param {object} options
 * @param {HTMLElement | null | undefined} options.tableEl
 * @param {HTMLElement | null | undefined} options.pagerEl
 * @param {HTMLElement | null | undefined} [options.containerEl]
 * @param {number} [options.offset]
 * @param {number} [options.minHeight]
 */
export function calcTableHeightByPosition(options = {}) {
  const {
    tableEl,
    pagerEl,
    containerEl,
    offset = 0,
    minHeight = 300
  } = options

  if (!tableEl) return null

  const ancestors = getScrollableAncestors(tableEl)
  const container = containerEl ?? ancestors[ancestors.length - 1] ?? document.documentElement
  const containerBottom = container.getBoundingClientRect().bottom
  const tableTop = tableEl.getBoundingClientRect().top
  const pagerHeight = getOuterHeight(pagerEl)
  const height = containerBottom - tableTop - pagerHeight - offset

  return Math.max(height, minHeight)
}

/**
 * 基于 flex 容器实际高度计算表格高度
 * @param {object} options
 * @param {HTMLElement | null | undefined} options.tableEl
 * @param {number} [options.minHeight]
 */
export function calcTableHeightByFlex(options = {}) {
  const { tableEl, minHeight = 300 } = options

  if (!tableEl) return null

  const height = tableEl.clientHeight
  if (height <= 0) return null

  return Math.max(height, minHeight)
}
