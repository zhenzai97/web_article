/** 会员类型：1单位会员 2个人会员 */
export const VIP_TYPE_OPTIONS = [
  { label: "单位会员", value: 1, tagType: "primary" },
  { label: "个人会员", value: 2, tagType: "success" }
]

/** 会员属性（旧 position） */
export const VIP_OPTIONS = [
  { label: "其它", value: 0, tagType: "info" },
  { label: "会长单位", value: 1, tagType: "danger" },
  { label: "副会长单位", value: 2, tagType: "warning" },
  { label: "理事单位", value: 3, tagType: "" },
  { label: "会员单位", value: 4, tagType: "primary" },
  { label: "个人单位", value: 5, tagType: "success" }
]

/** 审核状态 */
export const EXAMINE_STATUS_OPTIONS = [
  { label: "待审核", value: 0, tagType: "warning" },
  { label: "已通过", value: 1, tagType: "success" },
  { label: "已拒绝", value: 2, tagType: "danger" }
]

/** 政治面貌 */
export const IDENTITY_OPTIONS = [
  { label: "共产党员", value: 1 },
  { label: "共青团员", value: 2 },
  { label: "群众", value: 3 },
  { label: "其它", value: 4 }
]

/** 性别 */
export const SEX_OPTIONS = [
  { label: "未知", value: 0 },
  { label: "男", value: 1 },
  { label: "女", value: 2 }
]

/** 个人标签（存库为逗号分隔） */
export const COMPANY_TAG_OPTIONS = [
  { label: "抖音", value: "1" },
  { label: "快手", value: "2" },
  { label: "微博", value: "3" },
  { label: "红木", value: "4" },
  { label: "大学生", value: "5" },
  { label: "主播", value: "6" },
  { label: "策划", value: "7" }
]
