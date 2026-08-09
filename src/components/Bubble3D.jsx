import { useState, useCallback } from 'react'

/**
 * Bubble3D —— 可点击戳破的立体泡泡
 *
 * 真实气泡质感：薄膜干涉般的彩虹边缘 + 明亮高光 + 半透明中心。
 * 点击后炸裂成 12 颗小粒子，2 秒后自动复原。
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
      tint: Math.random() > 0.5 ? 'lagoon' : 'mint',
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
          {/* 气泡主体：薄膜干涉彩虹边 + 明亮高光 + 半透明中心 */}
          <span
            className="absolute inset-0 animate-bob-slow rounded-full"
            style={{
              background: `
                radial-gradient(circle at 32% 26%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 18%),
                radial-gradient(circle at 68% 72%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 22%),
                radial-gradient(circle at 50% 50%, rgba(165,226,240,0.55) 0%, rgba(130,210,228,0.35) 35%, rgba(47,212,168,0.15) 65%, rgba(160,218,232,0.08) 100%)
              `,
              boxShadow: `
                inset 0 0 30px rgba(255,255,255,0.3),
                inset 0 -8px 20px rgba(20,184,214,0.08),
                0 0 0 1.5px rgba(20,184,214,0.2),
                0 0 0 3px rgba(47,212,168,0.1),
                0 4px 20px rgba(20,184,214,0.08)
              `,
            }}
          />

          {/* 顶部强高光弧线 */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse at 38% 22%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 40%)
              `,
            }}
          />
        </button>
      ) : (
        /* 炸裂粒子 */
        particles.map((p) => (
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
                  ${p.tint === 'lagoon' ? 'rgba(20,184,214,0.8)' : 'rgba(47,212,168,0.8)'},
                  rgba(255,255,255,0.5)
                )
              `,
              '--bx': `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`,
              '--by': `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))
      )}
    </div>
  )
}
