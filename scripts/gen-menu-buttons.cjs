const fs = require("node:fs")

const pages = [
  { parentId: "2074401312947818497", base: "system:user", name: "用户", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"], ["batchDelete", "批量删除"]] },
  { parentId: "2074401482192179202", base: "system:role", name: "角色", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"], ["assignMenu", "分配菜单"], ["batchDelete", "批量删除"]] },
  { parentId: "2074401625645764609", base: "system:menu", name: "菜单", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2074426025803689985", base: "content:article", name: "文章", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"], ["batchDelete", "批量删除"]] },
  { parentId: "2074426309422526466", base: "content:category", name: "分类", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2077581549781012481", base: "content:tourism", name: "文旅", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086741000000000001", base: "content:industryReport", name: "行业报告", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086771000000000001", base: "content:activity", name: "活动", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2077278473073451010", base: "operation:advertising", name: "广告", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2077278834836365313", base: "operation:advertisingSpace", name: "广告位", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2077594567025827841", base: "operation:homeSection", name: "首页配置", actions: [["edit", "编辑"]] },
  { parentId: "2078010202948026370", base: "operation:company", name: "会员单位", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086724053755408386", base: "operation:companyConfig", name: "会员配置", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086729895565283330", base: "operation:associationConfig", name: "协会配置", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086732000000000001", base: "member:committee", name: "专委会", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2078022268396212225", base: "recruitment:list", name: "招聘", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2078022465117458433", base: "recruitment:applicant", name: "应聘", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086713368648585217", base: "expert:list", name: "达人", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086716001593524226", base: "expert:application", name: "达人申请", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086751100000000001", base: "jade:resource", name: "非洲翠资源", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086751200000000001", base: "jade:committee", name: "非洲翠专委会", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086751300000000001", base: "jade:committeeConfig", name: "非洲翠配置", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] },
  { parentId: "2086751400000000001", base: "jade:committeeApply", name: "非洲翠申请", actions: [["add", "新增"], ["edit", "编辑"], ["delete", "删除"]] }
]

let id = 2091000000000000001n
const inserts = []
const mapping = {}

for (const page of pages) {
  let sort = 0
  mapping[page.base] = {}
  for (const [action, label] of page.actions) {
    const bid = id++
    const perm = `${page.base}:${action}`
    mapping[page.base][action] = perm
    inserts.push(`INSERT INTO menu (
    id, parentId, menuName, menuType, icon, sort, path, component, permCode, remark,
    visible, status, isCache, createUserId, createTime, updateTime, isDelete
)
SELECT
    ${bid}, ${page.parentId}, '${label}', 3, NULL, ${sort}, '', '', '${perm}', '${page.name}${label}',
    0, 1, 0, 2070350870232080386, NOW(), NOW(), 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE permCode = '${perm}' AND isDelete = 0);`)
    sort += 5
  }
}

const grant = `-- 给拥有父菜单的角色补授按钮权限
INSERT INTO role_menu (id, roleId, menuId, createTime)
SELECT
    2092000000000000000 + (@row := @row + 1),
    t.roleId,
    t.menuId,
    NOW()
FROM (
    SELECT DISTINCT rm.roleId, btn.id AS menuId
    FROM menu btn
    INNER JOIN role_menu rm ON rm.menuId = btn.parentId
    WHERE btn.menuType = 3
      AND btn.isDelete = 0
      AND btn.permCode IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 FROM role_menu x
          WHERE x.roleId = rm.roleId AND x.menuId = btn.id
      )
) t
CROSS JOIN (SELECT @row := 0) init;`

const sql = `-- 按钮级操作权限菜单（menuType=3）
-- 幂等：按 permCode 去重

${inserts.join("\n\n")}

${grant}
`

fs.writeFileSync("E:/study/java_project/api/spring_boot_article/sql/seed_menu_buttons.sql", sql, "utf8")
fs.writeFileSync("E:/study/java_project/web/web_article/src/common/constants/permission.js", `/** 业务按钮权限码（与 menu.permCode 保持一致） */
export const PERM = ${JSON.stringify(mapping, null, 2)}
`, "utf8")
console.log("ok", Object.keys(mapping).length, "modules")
