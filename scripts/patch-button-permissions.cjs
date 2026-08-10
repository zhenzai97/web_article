/**
 * 批量为业务列表页操作按钮补充 v-permission
 */
const fs = require("node:fs")
const path = require("node:path")

const root = path.resolve(__dirname, "../src/pages")

const targets = [
  {
    file: "content/article/index.vue",
    perm: "contentArticle",
    rules: [
      { match: /<el-button type="primary" :icon="CirclePlus" @click="handleAdd">/, replace: `<el-button v-permission="PERM.contentArticle.add" type="primary" :icon="CirclePlus" @click="handleAdd">` },
      { match: /<el-button type="danger" :icon="Delete" @click="handleBatchDelete">/, replace: `<el-button v-permission="PERM.contentArticle.batchDelete" type="danger" :icon="Delete" @click="handleBatchDelete">` },
      { match: /<el-button type="primary" text bg size="small" @click="handleUpdate\(row\)">/, replace: `<el-button v-permission="PERM.contentArticle.edit" type="primary" text bg size="small" @click="handleUpdate(row)">` },
      { match: /<el-button type="danger" text bg size="small" @click="handleDelete\(row\)">/, replace: `<el-button v-permission="PERM.contentArticle.delete" type="danger" text bg size="small" @click="handleDelete(row)">` }
    ]
  },
  {
    file: "system/user/index.vue",
    perm: "systemUser",
    rules: [
      { match: /<el-button type="primary" :icon="CirclePlus" @click="handleAdd">/, replace: `<el-button v-permission="PERM.systemUser.add" type="primary" :icon="CirclePlus" @click="handleAdd">` },
      { match: /<el-button type="danger" :icon="Delete"[^>]*>/, replace: (m) => m.includes("v-permission") ? m : m.replace("<el-button ", `<el-button v-permission="PERM.systemUser.batchDelete" `) },
      { match: /<el-button type="primary" text bg size="small" @click="handleUpdate\(row\)">/, replace: `<el-button v-permission="PERM.systemUser.edit" type="primary" text bg size="small" @click="handleUpdate(row)">` },
      { match: /<el-button type="danger" text bg size="small" @click="handleDelete\(row\)">/, replace: `<el-button v-permission="PERM.systemUser.delete" type="danger" text bg size="small" @click="handleDelete(row)">` }
    ]
  },
  {
    file: "system/role/index.vue",
    perm: "systemRole",
    rules: [
      { match: /<el-button type="primary" :icon="CirclePlus" @click="handleAdd">/, replace: `<el-button v-permission="PERM.systemRole.add" type="primary" :icon="CirclePlus" @click="handleAdd">` },
      { match: /<el-button type="danger" :icon="Delete">/, replace: `<el-button v-permission="PERM.systemRole.batchDelete" type="danger" :icon="Delete">` },
      { match: /<el-button type="primary" text bg size="small" @click="handleUpdate\(row\)">/, replace: `<el-button v-permission="PERM.systemRole.edit" type="primary" text bg size="small" @click="handleUpdate(row)">` },
      { match: /@click="handleAssignMenu\(row\)"/, replace: `v-permission="PERM.systemRole.assignMenu" @click="handleAssignMenu(row)"` },
      { match: /<el-button type="danger" text bg size="small" @click="handleDelete\(row\)">/, replace: `<el-button v-permission="PERM.systemRole.delete" type="danger" text bg size="small" @click="handleDelete(row)">` }
    ]
  },
  {
    file: "system/menu/index.vue",
    perm: "systemMenu",
    rules: [
      { match: /<el-button type="primary" :icon="CirclePlus" @click="handleAdd">/, replace: `<el-button v-permission="PERM.systemMenu.add" type="primary" :icon="CirclePlus" @click="handleAdd">` },
      { match: /<el-button type="primary" text bg size="small" @click="handleUpdate\(row\)">/, replace: `<el-button v-permission="PERM.systemMenu.edit" type="primary" text bg size="small" @click="handleUpdate(row)">` },
      { match: /<el-button type="danger" text bg size="small" @click="handleDelete\(row\)">/, replace: `<el-button v-permission="PERM.systemMenu.delete" type="danger" text bg size="small" @click="handleDelete(row)">` }
    ]
  }
]

const simpleCrud = [
  ["content/category/index.vue", "contentCategory"],
  ["content/tourism/index.vue", "contentTourism"],
  ["content/industryReport/index.vue", "contentIndustryReport"],
  ["operation/advertising/index.vue", "operationAdvertising"],
  ["operation/advertisingSpace/index.vue", "operationAdvertisingSpace"],
  ["member/company/index.vue", "memberCompany"],
  ["member/companyConfig/index.vue", "memberCompanyConfig"],
  ["member/associationConfig/index.vue", "memberAssociationConfig"],
  ["member/committee/index.vue", "memberCommittee"],
  ["recruitment/list/index.vue", "recruitmentList"],
  ["recruitment/applicant/index.vue", "recruitmentApplicant"],
  ["expert/list/index.vue", "expertList"],
  ["expert/application/index.vue", "expertApplication"],
  ["jade/resource/index.vue", "jadeResource"],
  ["jade/committee/index.vue", "jadeCommittee"],
  ["jade/committeeConfig/index.vue", "jadeCommitteeConfig"],
  ["jade/committeeApply/index.vue", "jadeCommitteeApply"]
]

for (const [file, perm] of simpleCrud) {
  targets.push({
    file,
    perm,
    rules: [
      {
        match: /<el-button([^>]*?)@click="handleAdd"/,
        replace: (m, attrs) => m.includes("v-permission") ? m : `<el-button v-permission="PERM.${perm}.add"${attrs}@click="handleAdd"`
      },
      {
        match: /<el-button([^>]*?)@click="handleUpdate\(row\)"/,
        replace: (m, attrs) => m.includes("v-permission") ? m : `<el-button v-permission="PERM.${perm}.edit"${attrs}@click="handleUpdate(row)"`
      },
      {
        match: /<el-button([^>]*?)@click="handleDelete\(row\)"/,
        replace: (m, attrs) => m.includes("v-permission") ? m : `<el-button v-permission="PERM.${perm}.delete"${attrs}@click="handleDelete(row)"`
      },
      {
        match: /<el-button([^>]*?)@click="handleBatchDelete"/,
        replace: (m, attrs) => {
          if (m.includes("v-permission")) return m
          // only if batchDelete exists in PERM - skip for modules without it
          return m
        }
      }
    ]
  })
}

function ensureImport(content, permKey) {
  if (content.includes("@@/constants/permission")) return content
  if (content.includes("from \"@@/constants/")) {
    return content.replace(
      /(import .+ from "@@\/constants\/[^"]+"\n)/,
      `$1import { PERM } from "@@/constants/permission"\n`
    )
  }
  // after first import block
  return content.replace(
    /(<script setup>\n)/,
    `$1import { PERM } from "@@/constants/permission"\n`
  )
}

let updated = 0
for (const target of targets) {
  const full = path.join(root, target.file)
  if (!fs.existsSync(full)) {
    console.log("skip missing", target.file)
    continue
  }
  let content = fs.readFileSync(full, "utf8")
  const before = content
  content = ensureImport(content, target.perm)
  for (const rule of target.rules) {
    if (typeof rule.replace === "function") {
      content = content.replace(rule.match, rule.replace)
    } else {
      content = content.replace(rule.match, rule.replace)
    }
  }
  if (content !== before) {
    fs.writeFileSync(full, content, "utf8")
    updated++
    console.log("updated", target.file)
  } else {
    console.log("no change", target.file)
  }
}

// homeSection save button
const homeSection = path.join(root, "operation/homeSection/index.vue")
if (fs.existsSync(homeSection)) {
  let content = fs.readFileSync(homeSection, "utf8")
  const before = content
  content = ensureImport(content)
  content = content.replace(
    /<el-button(\s[^>]*?)>\s*\n\s*保存/,
    (m, attrs) => {
      if (attrs.includes("v-permission")) return m
      return `<el-button v-permission="PERM.operationHomeSection.edit"${attrs}>\n                保存`
    }
  )
  // also match single-line save
  content = content.replace(
    /(<el-button)((?:(?!v-permission)[^>])*>)\s*保存\s*<\/el-button>/,
    `$1 v-permission="PERM.operationHomeSection.edit"$2 保存</el-button>`
  )
  if (content !== before) {
    fs.writeFileSync(homeSection, content, "utf8")
    updated++
    console.log("updated operation/homeSection/index.vue")
  }
}

console.log("done, updated", updated)
