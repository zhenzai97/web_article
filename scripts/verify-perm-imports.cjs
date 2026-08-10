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

const missing = []
let ok = 0
for (const file of walk(root)) {
  const content = fs.readFileSync(file, "utf8")
  if (!content.includes("v-permission")) continue
  if (!content.includes("constants/permission")) {
    missing.push(path.relative(root, file))
  } else {
    ok++
  }
}
console.log("ok", ok)
console.log("missing", missing)
