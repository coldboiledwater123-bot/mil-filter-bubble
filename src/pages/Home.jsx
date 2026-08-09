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

/** 互动泡泡 —— 散布全屏，肥皂泡上升效果，点击戳破 */
function BubbleField() {
  /* 手机缩小至 55%，sm+ 自然大小；分散在边角避免遮挡主 CTA */
  const bubbles = [
    { size: 115, left: '0%',  top: '6%',  anim: 'animate-bubble-rise',       delay: '0s' },
    { size: 155, left: '12%', top: '65%', anim: 'animate-bubble-rise-slow',  delay: '2s' },
    { size: 100, left: '48%', top: '3%',  anim: 'animate-bubble-rise',       delay: '1s' },
    { size: 135, left: '80%', top: '8%',  anim: 'animate-bubble-rise-slow',  delay: '3.5s' },
    { size: 140, left: '2%',  top: '38%', anim: 'animate-bubble-rise-slow',  delay: '1.5s' },
    { size: 110, left: '70%', top: '58%', anim: 'animate-bubble-rise',       delay: '0.7s' },
    { size: 145, left: '33%', top: '76%', anim: 'animate-bubble-rise-slow',  delay: '4s' },
    { size:  95, left: '42%', top: '42%', anim: 'animate-bubble-rise',       delay: '2.8s' },
    { size: 150, left: '85%', top: '35%', anim: 'animate-bubble-rise-slow',  delay: '5s' },
    { size: 130, left: '18%', top: '18%', anim: 'animate-bubble-rise',       delay: '3.2s' },
    { size: 105, left: '56%', top: '28%', anim: 'animate-bubble-rise',       delay: '1.8s' },
    { size: 125, left: '8%',  top: '82%', anim: 'animate-bubble-rise-slow',  delay: '0.4s' },
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
          {/* 手机缩小至 52%，sm 以上原始大小 —— 避免遮挡 CTA */}
          <Bubble3D size={b.size} className="scale-[0.52] sm:scale-100" />
        </div>
      ))}
    </div>
  )
}
