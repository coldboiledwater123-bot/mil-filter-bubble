import { useState, useCallback } from 'react'

/**
 * Bubble3D —— 可点击戳破的肥皂泡
 *
 * 真实肥皂泡质感：
 * - 薄膜干涉彩虹边缘（粉色 → 蓝色 → 绿色 → 金色渐变环）
 * - 流动彩虹 hue-rotate 动画
 * - 明亮双高光
 * - 半透明中心
 *
 * 点击后炸裂成 12 颗彩色粒子，2.2 秒后自动复原。
 */
const PARTICLE_COUNT = 12

export default function Bubble3D({ size = 200, className = '' }) {
  const [popped, setPopped] = useState(false)
  const [particles, setParticles] = useState([])

  const handlePop = useCallback(() => {
    if (popped) return
    setPopped(true)

    const frags = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      angle: (i / PARTICLE_COUNT) * 360 + (Math.random() - 0.5) * 40,
      distance: size * 0.5 + Math.random() * size * 0.7,
      size: 6 + Math.random() * 14,
      delay: Math.random() * 0.15,
      tint: ['lagoon', 'mint', 'rose', 'amber'][i % 4],
      cx: Math.random() * 0.3 + 0.35,
      cy: Math.random() * 0.3 + 0.35,
    }))
    setParticles(frags)

    setTimeout(() => {
      setPopped(false)
      setParticles([])
    }, 2200)
  }, [popped, size])

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 1.3, height: size * 1.3 }}
    >
      {!popped ? (
        /* 主泡泡 */
        <button
          type="button"
          onClick={handlePop}
          className="group relative cursor-pointer rounded-full transition-transform hover:scale-110 active:scale-90"
          style={{ width: size, height: size }}
          aria-label="Click to pop the bubble"
        >
          {/* ── 流动彩虹环（薄膜干涉外缘）── */}
          <span
            className="absolute inset-0 animate-bob-slow rounded-full"
            style={{
              animation: 'iridescence 4s ease-in-out infinite',
              background: `
                radial-gradient(circle at 50% 50%,
                  transparent 55%,
                  rgba(255,140,180,0.18) 64%,
                  rgba(140,210,255,0.20) 72%,
                  rgba(160,240,190,0.18) 80%,
                  rgba(255,200,130,0.15) 88%,
                  rgba(200,170,255,0.12) 96%
                )
              `,
            }}
          />

          {/* ── 主体：半透明气泡 + 双高光 ── */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 24%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 16%),
                radial-gradient(circle at 72% 68%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 18%),
                radial-gradient(circle at 50% 50%, rgba(165,226,240,0.25) 0%, rgba(130,210,228,0.18) 35%, rgba(47,212,168,0.08) 65%, rgba(160,218,232,0.03) 100%)
              `,
              boxShadow: `
                inset 0 0 30px rgba(255,255,255,0.20),
                inset 0 -6px 16px rgba(20,184,214,0.04),
                0 0 0 1px rgba(255,255,255,0.22),
                0 0 0 2.5px rgba(180,210,240,0.12),
                0 2px 16px rgba(20,184,214,0.04)
              `,
            }}
          />

          {/* ── 顶部高光弧 ── */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse at 35% 20%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0) 35%)
              `,
            }}
          />
        </button>
      ) : (
        /* 炸裂粒子 */
        particles.map((p) => {
          const colors = {
            lagoon: 'rgba(20,184,214,0.7)',
            mint: 'rgba(47,212,168,0.7)',
            rose: 'rgba(255,150,200,0.7)',
            amber: 'rgba(255,200,100,0.7)',
          }
          return (
            <span
              key={p.id}
              className="absolute rounded-full animate-burst-out"
              style={{
                width: p.size,
                height: p.size,
                left: '50%',
                top: '50%',
                marginLeft: -(p.size / 2),
                marginTop: -(p.size / 2),
                background: `
                  radial-gradient(circle at ${p.cx * 100}% ${p.cy * 100}%,
                    ${colors[p.tint]},
                    rgba(255,255,255,0.5)
                  )
                `,
                '--bx': `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`,
                '--by': `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`,
                animationDelay: `${p.delay}s`,
              }}
            />
          )
        })
      )}
    </div>
  )
}
