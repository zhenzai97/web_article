import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import {
  Briefcase,
  Collection,
  Document,
  Grape,
  Location,
  OfficeBuilding,
  Picture,
  Promotion,
  Reading,
  User,
  UserFilled
} from "@element-plus/icons-vue"

export const homeStats = {
  article: {
    label: "文章",
    total: 0,
    enabled: 0,
    disabled: 0,
    icon: Document,
    theme: "blue",
    byCategory: []
  },
  tourism: {
    label: "文旅内容",
    total: 0,
    enabled: 0,
    icon: Location,
    theme: "amber",
    byType: TOURISM_TYPE_OPTIONS.map(item => ({
      type: item.value,
      label: item.label,
      count: 0
    }))
  }
}

export const emptyBizStats = {
  companyTotal: 0,
  expertTotal: 0,
  recruitmentTotal: 0,
  applicantTotal: 0,
  industryReportTotal: 0,
  jadeResourceTotal: 0,
  committeeTotal: 0,
  advertisingActive: 0,
  advertisingExpiring: 0,
  expertApplyTotal: 0,
  jadeApplyPending: 0
}

export const weekTrend = [
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 }
]

export const recentArticles = []
export const recentTourism = []
export const recentAdvertising = []
export const todos = []

export const quickLinks = [
  { title: "文章管理", path: "/content/article", icon: Document },
  { title: "行业报告", path: "/content/industryReport", icon: Reading },
  { title: "文旅内容", path: "/content/tourism", icon: Location },
  { title: "会员单位", path: "/member/company", icon: OfficeBuilding },
  { title: "专委会", path: "/member/committee", icon: Collection },
  { title: "招聘列表", path: "/recruitment/list", icon: Briefcase },
  { title: "达人列表", path: "/expert/list", icon: UserFilled },
  { title: "非洲翠资源", path: "/jade/resource", icon: Grape },
  { title: "运营广告", path: "/operation/advertising", icon: Promotion },
  { title: "用户管理", path: "/system/user", icon: User },
  { title: "广告位", path: "/operation/advertisingSpace", icon: Picture }
]

export function buildWorkflowSteps(bizStats = emptyBizStats, articleTotal = 0) {
  const pending = (bizStats.jadeApplyPending || 0) + (bizStats.advertisingExpiring || 0)
  return [
    { label: "内容维护", done: articleTotal > 0 },
    { label: "运营配置", done: (bizStats.advertisingActive || 0) > 0 },
    { label: "待办处理", done: pending === 0 },
    { label: "数据复盘", done: false }
  ]
}

export function buildBizMetrics(bizStats = emptyBizStats) {
  return [
    { key: "company", label: "会员单位", value: bizStats.companyTotal, path: "/member/company", theme: "blue" },
    { key: "expert", label: "达人", value: bizStats.expertTotal, path: "/expert/list", theme: "violet" },
    { key: "recruitment", label: "招聘岗位", value: bizStats.recruitmentTotal, path: "/recruitment/list", theme: "amber" },
    { key: "applicant", label: "应聘记录", value: bizStats.applicantTotal, path: "/recruitment/applicant", theme: "green" },
    { key: "report", label: "行业报告", value: bizStats.industryReportTotal, path: "/content/industryReport", theme: "blue" },
    { key: "jade", label: "非洲翠资源", value: bizStats.jadeResourceTotal, path: "/jade/resource", theme: "violet" },
    { key: "committee", label: "专委会", value: bizStats.committeeTotal, path: "/member/committee", theme: "amber" },
    { key: "ad", label: "生效广告", value: bizStats.advertisingActive, path: "/operation/advertising", theme: "green" }
  ]
}
