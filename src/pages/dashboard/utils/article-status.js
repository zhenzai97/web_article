import { ARTICLE_STATUS_MAP, ArticleStatusEnum } from "@@/constants/article"

const statusMap = {
  published: { label: "已发布", type: "success" },
  draft: { label: "草稿", type: "info" },
  review: { label: "待审核", type: "warning" },
  offline: { label: "已下线", type: "danger" }
}

export function getArticleStatus(status) {
  return statusMap[status]
}

/** 后端状态枚举 → 工作台展示状态 */
export function mapApiStatusToUi(status) {
  switch (status) {
    case ArticleStatusEnum.Published:
      return "published"
    case ArticleStatusEnum.Review:
      return "review"
    case ArticleStatusEnum.Offline:
      return "offline"
    default:
      return "draft"
  }
}

/** 列表页状态标签 */
export function getArticleStatusLabel(status) {
  return ARTICLE_STATUS_MAP[status]?.label ?? "未知"
}
