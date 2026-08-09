import { useState, useCallback } from 'react'

/**
 * Bubble3D —— 参考真实肥皂泡照片重构
 *
 * 质感来源：
 * - 高度透明（背景可见）
 * - 不规则的薄膜干涉色斑（多个偏移椭圆渐变叠加，而非同心圆环）
 * - 极小的锐利高光（模拟点光源反射）
 * - 细薄边缘
 * - 点击炸裂
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
      size: 4 + Math.random() * 10,
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
      style={{ width: size * 1.2, height: size * 1.2 }}
    >
      {!popped ? (
        <button
          type="button"
          onClick={handlePop}
          className="group relative cursor-pointer rounded-full transition-transform hover:scale-110 active:scale-95"
          style={{ width: size, height: size }}
          aria-label="Click to pop the bubble"
        >
          {/* ── 主体微白底，让泡泡可见 ── */}
          <span
            className="absolute inset-0 animate-bob-slow rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
              boxShadow: `
                inset 0 0 0 2px rgba(255,255,255,0.55),
                0 0 0 1px rgba(255,255,255,0.30)
              `,
            }}
          />

          {/* ── 左上角一小片彩虹色斑 ── */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 28% 22% at 24% 26%, rgba(245,140,180,0.25) 0%, transparent 100%),
                radial-gradient(ellipse 20% 16% at 30% 22%, rgba(140,210,245,0.18) 0%, transparent 100%)
              `,
            }}
          />

          {/* ── 小锐利高光 ── */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              left: '26%',
              top: '20%',
              width: '10%',
              height: '9%',
              background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 30%, transparent 70%)',
            }}
          />
        </button>
      ) : (
        particles.map((p) => {
          const colors = {
            lagoon: 'rgba(20,184,214,0.7)',
            mint: 'rgba(47,212,168,0.7)',
            rose: 'rgba(245,120,170,0.7)',
            amber: 'rgba(245,200,110,0.7)',
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
