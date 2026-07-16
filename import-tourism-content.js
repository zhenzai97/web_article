/**
 * 将 6 类文旅 CMS 导出 JSON 转为 tourism_content 导入 SQL
 * - cloud:// → HTTPS（cover / album）
 * - intro/desc → intro
 * - is_recommend → isRecommend
 * - read → readCount
 *
 * 用法：
 *   node import-tourism-content.js
 *   node import-tourism-content.js --out E:/study/java_project/api/spring_boot_article/sql/seed_tourism_content.sql
 */

import fs from "node:fs"
import path from "node:path"

function parseCloudFileId(cloudUrl) {
  const match = String(cloudUrl).trim().match(/^cloud:\/\/([^.]+)\.([^/]+)\/(.+)$/)
  if (!match) {
    throw new Error(`无法解析 cloud 地址: ${cloudUrl}`)
  }
  const [, envId, bucketId, filePath] = match
  return {
    envId,
    bucketId,
    filePath,
    httpsUrl: `https://${bucketId}.tcb.qcloud.la/${filePath}`
  }
}

const DEFAULT_FILES = [
  { type: "product", file: "cms-data-export-2026-07-16-78040-农产品.json" },
  { type: "brand", file: "cms-data-export-2026-07-16-72710-品牌.json" },
  { type: "market", file: "cms-data-export-2026-07-16-7901-市场.json" },
  { type: "jewelry", file: "cms-data-export-2026-07-16-60436-珠宝玉石.json" },
  { type: "food", file: "cms-data-export-2026-07-16-52441-美食.json" },
  { type: "scenic", file: "cms-data-export-2026-07-16-36800-景点.json" }
]

function convertCloudUrl(url) {
  if (typeof url !== "string" || !url.trim().startsWith("cloud://")) {
    return url
  }
  return parseCloudFileId(url).httpsUrl
}

function convertCloudInText(text) {
  if (typeof text !== "string" || !text.includes("cloud://")) {
    return text
  }
  return text.replace(/cloud:\/\/[^\s"'<>]+/g, (match) => {
    try {
      return convertCloudUrl(match)
    } catch {
      return match
    }
  })
}

function toDateTime(ms) {
  if (!ms || typeof ms !== "number") {
    return null
  }
  const d = new Date(ms)
  const pad = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function sqlString(value) {
  if (value === null || value === undefined || value === "") {
    return "NULL"
  }
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`
}

function sqlJson(value) {
  if (value === null || value === undefined) {
    return "NULL"
  }
  return sqlString(JSON.stringify(value))
}

function normalizeAlbum(album) {
  if (!Array.isArray(album) || !album.length) {
    return null
  }
  const urls = album
    .map((item) => {
      if (typeof item === "string") {
        return convertCloudUrl(item)
      }
      if (item && typeof item === "object" && typeof item.url === "string") {
        return convertCloudUrl(item.url)
      }
      return null
    })
    .filter(Boolean)
  return urls.length ? urls : null
}

function mapItem(type, item) {
  const cover = convertCloudUrl(item.cover || "") || null
  const intro = item.intro ?? item.desc ?? null
  const content = convertCloudInText(item.content || null)
  const album = normalizeAlbum(item.album)
  const status = item.status === false || item.status === 0 ? 0 : 1
  const isRecommend = item.is_recommend === true || item.is_recommend === 1 ? 1 : 0
  const readCount = typeof item.read === "number" ? item.read : 0

  return {
    type,
    name: item.name || "",
    cover,
    intro,
    content,
    sort: typeof item.sort === "number" ? item.sort : 0,
    status,
    isRecommend,
    readCount,
    album,
    address: item.address || null,
    coordinate: item.coordinate || null,
    mobile: item.mobile || null,
    openTime: item.open_time || null,
    ticketPrice: item.ticket_price != null ? String(item.ticket_price) : null,
    sourceId: item._id || null,
    createTime: toDateTime(item._createTime),
    updateTime: toDateTime(item._updateTime)
  }
}

function toInsert(row) {
  const cols = [
    "type",
    "name",
    "cover",
    "intro",
    "content",
    "sort",
    "status",
    "isRecommend",
    "readCount",
    "album",
    "address",
    "coordinate",
    "mobile",
    "openTime",
    "ticketPrice",
    "sourceId",
    "createTime",
    "updateTime",
    "isDelete"
  ]
  const vals = [
    sqlString(row.type),
    sqlString(row.name),
    sqlString(row.cover),
    sqlString(row.intro),
    sqlString(row.content),
    row.sort,
    row.status,
    row.isRecommend,
    row.readCount,
    sqlJson(row.album),
    sqlString(row.address),
    sqlString(row.coordinate),
    sqlString(row.mobile),
    sqlString(row.openTime),
    sqlString(row.ticketPrice),
    sqlString(row.sourceId),
    sqlString(row.createTime),
    sqlString(row.updateTime),
    0
  ]
  return `INSERT INTO tourism_content (${cols.join(", ")}) VALUES (${vals.join(", ")});`
}

function parseArgs(argv) {
  let downloadsDir = path.join("C:/Users/zhenzai/Downloads")
  let outPath = path.resolve(
    "E:/study/java_project/api/spring_boot_article/sql/seed_tourism_content.sql"
  )
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--downloads") {
      downloadsDir = path.resolve(argv[++i] || downloadsDir)
    } else if (argv[i] === "--out") {
      outPath = path.resolve(argv[++i] || outPath)
    }
  }
  return { downloadsDir, outPath }
}

function main() {
  const { downloadsDir, outPath } = parseArgs(process.argv.slice(2))
  const rows = []
  const stats = {}

  for (const { type, file } of DEFAULT_FILES) {
    const filePath = path.join(downloadsDir, file)
    if (!fs.existsSync(filePath)) {
      console.error(`缺少文件: ${filePath}`)
      process.exit(1)
    }
    const list = JSON.parse(fs.readFileSync(filePath, "utf8"))
    if (!Array.isArray(list)) {
      console.error(`根节点不是数组: ${file}`)
      process.exit(1)
    }
    stats[type] = list.length
    for (const item of list) {
      rows.push(mapItem(type, item))
    }
  }

  const header = [
    "-- 文旅内容导入数据（由 import-tourism-content.js 生成）",
    "-- 执行前请先运行 create_tourism_content.sql",
    "-- 幂等：按 sourceId 冲突时更新",
    ""
  ]

  // 用 INSERT ... ON DUPLICATE KEY UPDATE，依赖 uk_sourceId
  const statements = rows.map((row) => {
    const insert = toInsert(row).replace(/;$/, "")
    return `${insert} ON DUPLICATE KEY UPDATE
  type=VALUES(type), name=VALUES(name), cover=VALUES(cover), intro=VALUES(intro), content=VALUES(content),
  sort=VALUES(sort), status=VALUES(status), isRecommend=VALUES(isRecommend), readCount=VALUES(readCount),
  album=VALUES(album), address=VALUES(address), coordinate=VALUES(coordinate), mobile=VALUES(mobile),
  openTime=VALUES(openTime), ticketPrice=VALUES(ticketPrice), updateTime=VALUES(updateTime), isDelete=0;`
  })

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${header.join("\n")}${statements.join("\n")}\n`, "utf8")

  console.log(`输出: ${outPath}`)
  console.log(`总计: ${rows.length}`)
  console.log("分类统计:", stats)
  console.log(`封面 HTTPS 示例: ${rows.find(r => r.cover?.startsWith("https://"))?.cover || "(无)"}`)
}

main()
