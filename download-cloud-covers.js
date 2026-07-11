/**
 * 微信云存储 cloud:// 批量下载脚本
 *
 * cloud:// 与 HTTPS 对应关系：
 *   cloud://{环境ID}.{存储桶ID}/{文件路径}
 *   -> https://{存储桶ID}.tcb.qcloud.la/{文件路径}
 *
 * 示例：
 *   cloud://dhxmt-9gv6uup2086a6329.6468-dhxmt-9gv6uup2086a6329-1325662932/kit-cms-upload/2024-10-10/a.png
 *   -> https://6468-dhxmt-9gv6uup2086a6329-1325662932.tcb.qcloud.la/kit-cms-upload/2024-10-10/a.png
 *
 * 用法：
 *   node download-cloud-covers.js [json路径] [--out 输出目录] [--field 字段名] [--skip-existing]
 *
 * 示例：
 *   node download-cloud-covers.js "C:/Users/zhenzai/Downloads/cms-data-export-2026-07-11-54162.json"
 *   node download-cloud-covers.js ./data.json --out ./cloud-downloads --field cover
 */

import { Buffer } from "node:buffer"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 解析 cloud:// 为 HTTPS 与本地相对路径 */
export function parseCloudFileId(cloudUrl) {
  const match = String(cloudUrl).trim().match(/^cloud:\/\/([^.]+)\.([^/]+)\/(.+)$/)
  if (!match) {
    throw new Error(`无法解析 cloud 地址: ${cloudUrl}`)
  }

  const [, envId, bucketId, filePath] = match
  const httpsUrl = `https://${bucketId}.tcb.qcloud.la/${filePath}`

  return {
    envId,
    bucketId,
    filePath,
    httpsUrl,
    localPath: filePath.replace(/\//g, path.sep)
  }
}

function parseArgs(argv) {
  const positional = []
  let outDir = path.join(__dirname, "cloud-downloads")
  let field = "cover"
  let overwrite = true

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--out") {
      outDir = path.resolve(argv[++i] || outDir)
    } else if (arg === "--field") {
      field = argv[++i] || field
    } else if (arg === "--skip-existing") {
      overwrite = false
    } else if (!arg.startsWith("--")) {
      positional.push(arg)
    }
  }

  return {
    jsonPath: positional[0]
      ? path.resolve(positional[0])
      : path.resolve(__dirname, "cms-data-export.json"),
    outDir,
    field,
    overwrite
  }
}

async function downloadFile(httpsUrl, destPath, overwrite = true) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  if (!overwrite && fs.existsSync(destPath)) {
    return { status: "skipped", destPath }
  }

  const response = await fetch(httpsUrl)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${httpsUrl}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(destPath, buffer)

  return { status: "downloaded", destPath, size: buffer.length }
}

async function main() {
  const { jsonPath, outDir, field, overwrite } = parseArgs(process.argv.slice(2))

  if (!fs.existsSync(jsonPath)) {
    console.error(`JSON 文件不存在: ${jsonPath}`)
    console.error("用法: node download-cloud-covers.js <json路径> [--out 输出目录] [--field cover]")
    process.exit(1)
  }

  const list = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  if (!Array.isArray(list)) {
    console.error("JSON 根节点必须是数组")
    process.exit(1)
  }

  const cloudUrls = [...new Set(
    list
      .map(item => item?.[field])
      .filter(url => typeof url === "string" && url.startsWith("cloud://"))
  )]

  if (cloudUrls.length === 0) {
    console.log(`未找到字段 "${field}" 中的 cloud:// 地址`)
    return
  }

  console.log(`JSON: ${jsonPath}`)
  console.log(`字段: ${field}`)
  console.log(`输出: ${outDir}`)
  console.log(`覆盖已存在: ${overwrite ? "是" : "否"}`)
  console.log(`待下载: ${cloudUrls.length} 个文件\n`)

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < cloudUrls.length; i++) {
    const cloudUrl = cloudUrls[i]
    try {
      const { httpsUrl, localPath } = parseCloudFileId(cloudUrl)
      const destPath = path.join(outDir, localPath)

      if (cloudUrls.length <= 10) {
        console.log(`cloud: ${cloudUrl}`)
        console.log(`https: ${httpsUrl}`)
      } else if (i === 0 || (i + 1) % 50 === 0 || i === cloudUrls.length - 1) {
        console.log(`[${i + 1}/${cloudUrls.length}] 下载中...`)
      }

      const result = await downloadFile(httpsUrl, destPath, overwrite)

      if (result.status === "skipped") {
        skipped++
        if (cloudUrls.length <= 10) {
          console.log(`跳过（已存在）: ${result.destPath}\n`)
        }
      } else {
        downloaded++
        if (cloudUrls.length <= 10) {
          console.log(`完成: ${result.destPath} (${result.size} bytes)\n`)
        }
      }
    } catch (error) {
      failed++
      console.error(`失败 [${i + 1}/${cloudUrls.length}]: ${cloudUrl}`)
      console.error(`  ${error.message}`)
    }
  }

  console.log("---")
  console.log(`下载成功: ${downloaded}`)
  console.log(`已存在跳过: ${skipped}`)
  console.log(`失败: ${failed}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
