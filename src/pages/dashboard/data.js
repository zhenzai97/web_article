import { Document, EditPen, Menu, Timer, User, View } from "@element-plus/icons-vue"

export const homeStats = [
  { label: "文章总数", value: "128", trend: "+12 本月", icon: Document, theme: "blue" },
  { label: "草稿箱", value: "12", trend: "3 篇待完善", icon: EditPen, theme: "amber" },
  { label: "已发布", value: "96", trend: "占比 75%", icon: View, theme: "green" },
  { label: "待审核", value: "8", trend: "需尽快处理", icon: Timer, theme: "rose" }
]

export const weekTrend = [
  { label: "周一", value: 4 },
  { label: "周二", value: 7 },
  { label: "周三", value: 5 },
  { label: "周四", value: 9 },
  { label: "周五", value: 6 },
  { label: "周六", value: 3 },
  { label: "周日", value: 8 }
]

export const categories = [
  { name: "技术分享", count: 48, percent: 38 },
  { name: "产品更新", count: 32, percent: 25 },
  { name: "运营活动", count: 28, percent: 22 },
  { name: "团队动态", count: 20, percent: 15 }
]

export const recentArticles = [
  { id: "1", title: "Vue 3 组合式 API 最佳实践", category: "技术分享", author: "张三", status: "published", views: 1240, updateTime: "2026-07-07 14:20" },
  { id: "2", title: "七月产品功能更新说明", category: "产品更新", author: "李四", status: "review", views: 0, updateTime: "2026-07-07 11:05" },
  { id: "3", title: "前端工程化落地指南（草稿）", category: "技术分享", author: "王五", status: "draft", views: 0, updateTime: "2026-07-06 18:30" },
  { id: "4", title: "夏季运营活动方案", category: "运营活动", author: "赵六", status: "published", views: 856, updateTime: "2026-07-06 09:15" },
  { id: "5", title: "团队季度总结与规划", category: "团队动态", author: "管理员", status: "published", views: 432, updateTime: "2026-07-05 16:40" }
]

export const activities = [
  { id: 1, time: "14:20", user: "张三", action: "发布了", target: "《Vue 3 组合式 API 最佳实践》", type: "publish" },
  { id: 2, time: "11:05", user: "李四", action: "提交审核", target: "《七月产品功能更新说明》", type: "review" },
  { id: 3, time: "09:30", user: "王五", action: "更新了草稿", target: "《前端工程化落地指南》", type: "edit" },
  { id: 4, time: "昨天", user: "系统", action: "同步了", target: "菜单权限配置", type: "system" },
  { id: 5, time: "昨天", user: "赵六", action: "发布了", target: "《夏季运营活动方案》", type: "publish" }
]

export const quickLinks = [
  { title: "文章管理", desc: "内容 CRUD", path: "/content/article", icon: Document },
  { title: "栏目管理", desc: "sign 配置", path: "/content/category", icon: Menu },
  { title: "用户管理", desc: "账号与权限", path: "/system/user", icon: User }
]

export const workflowSteps = [
  { label: "撰写草稿", done: true },
  { label: "内容审核", done: true },
  { label: "排版发布", done: false },
  { label: "数据复盘", done: false }
]
