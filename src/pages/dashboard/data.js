import { TOURISM_TYPE_OPTIONS } from "@@/constants/tourism"
import {
  Document,
  Location,
  Menu,
  Picture,
  Promotion,
  User
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

export const weekTrend = [
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 },
  { label: "--", value: 0 }
]

export const categories = []

export const recentArticles = []

export const recentTourism = []

export const recentAdvertising = []

export const quickLinks = [
  { title: "文章管理", desc: "内容 CRUD", path: "/content/article", icon: Document },
  { title: "栏目管理", desc: "分类配置", path: "/content/category", icon: Menu },
  { title: "文旅内容", desc: "六类展示", path: "/content/tourism", icon: Location },
  { title: "运营广告", desc: "素材排期", path: "/operation/advertising", icon: Promotion },
  { title: "运营位", desc: "坑位配置", path: "/operation/advertisingSpace", icon: Picture },
  { title: "用户管理", desc: "账号权限", path: "/system/user", icon: User }
]

export const workflowSteps = [
  { label: "内容维护", done: true },
  { label: "运营配置", done: true },
  { label: "发布上线", done: false },
  { label: "数据复盘", done: false }
]
