import { Link } from 'react-router-dom'
import ParticleText from '../components/ParticleText'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-cream px-6 pt-[10vh] text-center sm:pt-[14vh] md:pt-[18vh]">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>

      {/* 粒子文本 */}
      <div className="h-[200px] w-full max-w-5xl sm:h-[300px] md:h-[380px]">
        <ParticleText
          text="Are you in filter Bubbles?"
          color="#22333b"
          highlightColor="#14b8d6"
          particleSize={2.5}
          density={3.5}
          scatter={200}
          gatherDuration={1800}
          stagger={380}
          fontSize="clamp(2.8rem, 10vw, 7.5rem)"
          fontWeight={900}
          glow={true}
        />
      </div>

      {/* 副标题 + 按钮 —— 粒子聚拢后淡入 */}
      <p
        className="animate-fade-in-up mt-6 max-w-2xl text-lg leading-relaxed text-clay sm:mt-8 sm:text-xl lg:text-2xl"
        style={{ animationDelay: '2s' }}
      >
        Everything you scroll, watch, and like
        <br className="hidden lg:block" />
        quietly shapes what the algorithm feeds you.
      </p>

      <div
        className="animate-fade-in-up mt-12 flex flex-col items-center"
        style={{ animationDelay: '2.4s' }}
      >
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
    </div>
  )
}
