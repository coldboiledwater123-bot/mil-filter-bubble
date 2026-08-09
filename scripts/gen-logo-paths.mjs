/**
 * gen-logo-paths.mjs —— 从素材库 assets/logos/*.svg 自动生成 logoPaths.js
 * 用法：node scripts/gen-logo-paths.mjs
 * 生成的组件代码以官方 SVG 文件为准，消除手写路径偏差。
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const srcDir = 'C:/Users/asd/Desktop/Claude_Hacthon/assets/logos'
const outFile = new URL('../src/components/logoPaths.js', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const files = readdirSync(srcDir).filter((f) => f.endsWith('.svg')).sort()

const paths = {}
const colors = {}

for (const f of files) {
  const id = f.replace('.svg', '')
  const content = readFileSync(join(srcDir, f), 'utf8')
  const ds = [...content.matchAll(/d="([^"]*)"/g)].map((m) => m[1].replace(/\s+/g, ' ').trim())
  if (ds.length === 0) {
    console.warn(`⚠ ${f}: 未找到 path d 属性，跳过`)
    continue
  }
  paths[id] = ds.join(' ')
  const fill = content.match(/fill="(#[0-9a-fA-F]{3,8})"/)
  if (fill) colors[id] = fill[1]
}

const pct = Object.keys(paths).length
if (pct < 10) {
  console.error(`✗ 只解析到 ${pct} 个 logo（预期 ≥10），终止，不覆盖现有文件`)
  process.exit(1)
}

const out = `/**
 * logoPaths.js —— 自动生成，请勿手改。
 * 源：Claude_Hacthon/assets/logos/*.svg（Simple Icons，CC0）
 * 重新生成：node scripts/gen-logo-paths.mjs
 */
export const PATHS = ${JSON.stringify(paths, null, 2)}

export const COLORS = ${JSON.stringify(colors, null, 2)}
`

writeFileSync(outFile, out, 'utf8')
console.log(`✔ 已生成 ${outFile}`)
console.log(`✔ ${pct} 个 logo，颜色: ${JSON.stringify(colors)}`)
