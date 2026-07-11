/** 文章状态：与后端约定一致 */
export const ArticleStatusEnum = {
  Draft: 0,
  Review: 1,
  Published: 2,
  Offline: 3
}

export const ARTICLE_STATUS_OPTIONS = [
  { label: "草稿", value: ArticleStatusEnum.Draft },
  { label: "待审核", value: ArticleStatusEnum.Review },
  { label: "已发布", value: ArticleStatusEnum.Published },
  { label: "已下线", value: ArticleStatusEnum.Offline }
]

export const ARTICLE_STATUS_MAP = {
  [ArticleStatusEnum.Draft]: { label: "草稿", tagType: "info" },
  [ArticleStatusEnum.Review]: { label: "待审核", tagType: "warning" },
  [ArticleStatusEnum.Published]: { label: "已发布", tagType: "success" },
  [ArticleStatusEnum.Offline]: { label: "已下线", tagType: "danger" }
}

/** 启用状态：0-禁用 1-启用 */
export const ENABLE_STATUS_OPTIONS = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "info" }
]

/** 是否选项：0-否 1-是 */
export const YES_NO_OPTIONS = [
  { label: "是", value: 1, tagType: "success" },
  { label: "否", value: 0, tagType: "info" }
]

/** wxapp 预置栏目 sign，供初始化参考 */
export const PRESET_CATEGORY_SIGNS = [
  { sign: "xhdt", name: "协会动态" },
  { sign: "wxyw", name: "网信要闻" },
  { sign: "dhnews", name: "精彩德宏-新闻" },
  { sign: "dhFunNews", name: "精彩德宏-好玩" },
  { sign: "dhFoodNews", name: "精彩德宏-好吃" },
  { sign: "jadeNews", name: "珠宝翡翠资讯" },
  { sign: "produceNews", name: "农产品资讯" },
  { sign: "zwhdt", name: "非洲绿联盟动态" }
]
