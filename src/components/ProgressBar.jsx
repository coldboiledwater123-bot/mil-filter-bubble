import { Link } from 'react-router-dom'

/**
 * 顶部进度条组件 —— 核心防迷失机制
 * 让用户永远知道：自己在哪一步、还剩几步、下一步去哪
 */
const STEPS = [
  { path: '/', label: 'Start', icon: '🏠' },
  { path: '/discover', label: 'Discover', icon: '🔍' },
  { path: '/simulate', label: 'Experience', icon: '📱' },
  { path: '/info', label: 'Info', icon: '🌐' },
  { path: '/act', label: 'Act', icon: '🛠️' },
]

export default function ProgressBar({ current }) {
  const currentIdx = STEPS.findIndex((s) => s.path === current)

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-peach bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-2 py-3 sm:px-4 sm:py-4">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx
          const isClickable = i <= currentIdx // 已完成和当前可点击跳转

          const node = (
            <span
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 text-xs font-bold transition-all sm:gap-1 sm:rounded-2xl sm:px-4 sm:py-1.5 sm:text-lg ${
                isCurrent
                  ? 'bg-lagoon text-white shadow-xl shadow-lagoon/30'
                  : isDone
                    ? 'text-lagoon hover:bg-lagoon/10'
                    : 'text-clay/40'
              }`}
            >
              <span className="text-xl leading-none sm:text-3xl">{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
          )

          return (
            <div key={step.path} className="flex flex-1 items-center">
              {isClickable ? (
                <Link to={step.path} className="flex-1">
                  {node}
                </Link>
              ) : (
                <div className="flex-1">{node}</div>
              )}
              {i < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 rounded ${
                    i < currentIdx ? 'bg-lagoon' : 'bg-peach/60'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
