import { Link } from 'react-router-dom'
import Bubble3D from '../components/Bubble3D'

/** 首页（极简单屏）——
 *  大标题 + 一句通俗解释 + 居中偏下的大按钮 + 可戳破的大泡泡
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-30px) translateX(8px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-60px) translateX(-6px);
            opacity: 0.75;
          }
          75% {
            transform: translateY(-90px) translateX(4px);
            opacity: 0.65;
          }
          100% {
            transform: translateY(-120px) translateX(0);
            opacity: 0.6;
          }
        }
        @keyframes bubble-rise-slow {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          33% {
            transform: translateY(-50px) translateX(-10px);
            opacity: 0.65;
          }
          66% {
            transform: translateY(-100px) translateX(6px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-150px) translateX(0);
            opacity: 0.5;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise 6s ease-in-out infinite;
        }
        .animate-bubble-rise-slow {
          animation: bubble-rise-slow 9s ease-in-out infinite;
        }
      `}</style>

      <BubbleField />

      <main className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* 标题组 */}
        <h1 className="font-display text-4xl font-extrabold leading-tight text-cocoa sm:text-5xl lg:text-7xl">
          Are you in{' '}
          <span className="relative inline-block text-lagoon">
            filter Bubbles?
            <span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-mint/70" />
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clay sm:mt-8 sm:text-xl lg:text-2xl">
          Everything you scroll, watch, and like
          <br className="hidden lg:block" />
          quietly shapes what the algorithm feeds you.
        </p>

        {/* 按钮（紧贴文字正下方） */}
        <div className="pointer-events-auto mt-12 flex flex-col items-center">
          <Link
            to="/discover"
            className="rounded-full bg-lagoon px-10 py-5 text-xl font-extrabold text-white shadow-2xl shadow-lagoon/40 transition-all hover:-translate-y-1 hover:shadow-lagoon/60 sm:px-16 sm:py-6 sm:text-2xl lg:px-20 lg:py-7 lg:text-3xl"
          >
            💥 BOOM THE BUBBLES
          </Link>
          <p className="mt-5 text-sm font-semibold tracking-wide text-clay">
            2 minutes · Free · No sign-up
          </p>
        </div>
      </main>
    </div>
  )
}

/** 互动泡泡 —— 散布全屏，海底气泡上升效果，点击戳破 */
function BubbleField() {
  const bubbles = [
    { size: 140, left: '1%', top: '8%', anim: 'animate-bubble-rise', delay: '0s' },
    { size: 180, left: '15%', top: '68%', anim: 'animate-bubble-rise-slow', delay: '2s' },
    { size: 120, left: '50%', top: '5%', anim: 'animate-bubble-rise', delay: '1s' },
    { size: 200, left: '78%', top: '10%', anim: 'animate-bubble-rise-slow', delay: '3.5s' },
    { size: 160, left: '4%', top: '40%', anim: 'animate-bubble-rise-slow', delay: '1.5s' },
    { size: 130, left: '68%', top: '60%', anim: 'animate-bubble-rise', delay: '0.7s' },
    { size: 170, left: '35%', top: '78%', anim: 'animate-bubble-rise-slow', delay: '4s' },
    { size: 110, left: '44%', top: '45%', anim: 'animate-bubble-rise', delay: '2.8s' },
    { size: 190, left: '82%', top: '38%', anim: 'animate-bubble-rise-slow', delay: '5s' },
    { size: 150, left: '22%', top: '22%', anim: 'animate-bubble-rise', delay: '3.2s' },
    { size: 125, left: '58%', top: '30%', anim: 'animate-bubble-rise', delay: '1.8s' },
    { size: 175, left: '10%', top: '85%', anim: 'animate-bubble-rise-slow', delay: '0.4s' },
  ]

  return (
    <div className="pointer-events-auto absolute inset-0 overflow-hidden" aria-hidden>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.anim}`}
          style={{
            left: b.left,
            top: b.top,
            zIndex: 0,
            animationDelay: b.delay,
          }}
        >
          <Bubble3D size={b.size} />
        </div>
      ))}
    </div>
  )
}
