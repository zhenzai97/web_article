const fs = require("node:fs")
const path = require("node:path")

const root = path.resolve(__dirname, "../src/pages")

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (entry.name === "index.vue") acc.push(full)
  }
  return acc
}

let fixed = 0
for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8")
  if (!content.includes("v-permission") || content.includes("constants/permission")) {
    continue
  }
  if (/from ["']@@\/constants\//.test(content)) {
    content = content.replace(
      /(import .+ from ["']@@\/constants\/[^"']+["']\r?\n)/,
      `$1import { PERM } from "@@/constants/permission"\n`
    )
  } else {
    content = content.replace(
      /(<script setup>\r?\n)/,
      `$1import { PERM } from "@@/constants/permission"\n`
    )
  }
  if (!content.includes("constants/permission")) {
    content = content.replace(
      "<script setup>",
      `<script setup>\nimport { PERM } from "@@/constants/permission"`
    )
  }
  fs.writeFileSync(file, content, "utf8")
  fixed++
  console.log("fixed", path.relative(root, file))
}
console.log("fixed count", fixed)
