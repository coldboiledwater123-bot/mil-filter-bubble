/**
 * BrandLogo —— 内联 SVG 品牌图标（Simple Icons，CC0 许可）
 * 路径数据由 scripts/gen-logo-paths.mjs 从素材库自动生成，见 logoPaths.js。
 * 直接渲染 SVG 元素，不经过 img/data-URI 加载，100% 可靠。
 * 选中态可用 color 覆盖品牌色（选中时变主题天蓝）。
 *
 * 用法：
 *   <BrandLogo id="tiktok" className="h-10 w-10" />
 *   <BrandLogo id="youtube" className="h-10 w-10 text-lagoon" />  ← 品牌色被覆盖
 */

import { PATHS, COLORS } from './logoPaths'

export const BRAND_IDS = Object.keys(PATHS)

export default function BrandLogo({ id, className = 'h-10 w-10', brand = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={brand ? (COLORS[id] ?? 'currentColor') : 'currentColor'}
      role="img"
      aria-label={id}
    >
      <path d={PATHS[id]} />
    </svg>
  )
}
