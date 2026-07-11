/**
 * 将 JSON 中的 cloud:// 地址批量转换为 HTTPS 网络路径
 *
 * cloud:// 与 HTTPS 对应关系：
 *   cloud://{环境ID}.{存储桶ID}/{文件路径}
 *   -> https://{存储桶ID}.tcb.qcloud.la/{文件路径}
 *
 * 用法：
 *   node convert-cloud-json.js [json路径] [--out 输出路径] [--field 字段名]
 *
 * 示例：
 *   node convert-cloud-json.js "C:/Users/zhenzai/Downloads/cms-data-export-2026-07-11-30654.json"
 *   node convert-cloud-json.js ./data.json --out ./data-https.json --field cover
 *   node convert-cloud-json.js ./data.json --field cover,video
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseCloudFileId } from "./download-cloud-covers.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function convertCloudUrl(url) {
  if (typeof url !== "string" || !url.trim().startsWith("cloud://")) {
    return url
  }

  return parseCloudFileId(url).httpsUrl
}

function parseArgs(argv) {
  const positional = []
  let outPath = ""
  let fields = ["cover"]

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--out") {
      outPath = path.resolve(argv[++i] || "")
    } else if (arg === "--field") {
      const value = argv[++i] || "cover"
      fields = value.split(",").map(item => item.trim()).filter(Boolean)
    } else if (!arg.startsWith("--")) {
      positional.push(arg)
    }
  }

  const jsonPath = positional[0]
    ? path.resolve(positional[0])
    : path.resolve(__dirname, "cms-data-export.json")

  if (!outPath) {
    const { dir, name, ext } = path.parse(jsonPath)
    outPath = path.join(dir, `${name}-https${ext || ".json"}`)
  }

  return { jsonPath, outPath, fields }
}

function main() {
  const { jsonPath, outPath, fields } = parseArgs(process.argv.slice(2))

  if (!fs.existsSync(jsonPath)) {
    console.error(`JSON 文件不存在: ${jsonPath}`)
    console.error("用法: node convert-cloud-json.js <json路径> [--out 输出路径] [--field cover]")
    process.exit(1)
  }

  const list = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  if (!Array.isArray(list)) {
    console.error("JSON 根节点必须是数组")
    process.exit(1)
  }

  const stats = Object.fromEntries(fields.map(field => [field, { converted: 0, skipped: 0, failed: 0 }]))

  const convertedList = list.map((item) => {
    const next = { ...item }

    for (const field of fields) {
      const value = next[field]
      if (typeof value !== "string" || !value.startsWith("cloud://")) {
        stats[field].skipped++
        continue
      }

      try {
        next[field] = convertCloudUrl(value)
        stats[field].converted++
      } catch (error) {
        stats[field].failed++
        console.error(`转换失败 [${field}]: ${value}`)
        console.error(`  ${error.message}`)
      }
    }

    return next
  })

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(convertedList, null, 2)}\n`, "utf8")

  console.log(`输入: ${jsonPath}`)
  console.log(`输出: ${outPath}`)
  console.log(`记录数: ${list.length}`)
  console.log("---")

  for (const field of fields) {
    const { converted, skipped, failed } = stats[field]
    console.log(`字段 ${field}: 转换 ${converted}，跳过 ${skipped}，失败 ${failed}`)
  }

  if (convertedList.length > 0) {
    const sampleField = fields.find(field => convertedList.some(item => item[field]?.startsWith("https://")))
    if (sampleField) {
      const sample = convertedList.find(item => item[sampleField]?.startsWith("https://"))
      console.log("---")
      console.log(`示例 ${sampleField}:`)
      console.log(sample[sampleField])
    }
  }
}

main()
