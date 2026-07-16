/** 文旅内容类型 */
export const TOURISM_TYPE_OPTIONS = [
  { label: "农产品", value: "product" },
  { label: "品牌", value: "brand" },
  { label: "市场", value: "market" },
  { label: "珠宝玉石", value: "jewelry" },
  { label: "美食", value: "food" },
  { label: "景点", value: "scenic" }
]

export const TOURISM_TYPE_MAP = Object.fromEntries(
  TOURISM_TYPE_OPTIONS.map(item => [item.value, item.label])
)
