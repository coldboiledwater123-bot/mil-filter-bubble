import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Bubble3D from '../components/Bubble3D'

/* ================= 数据 ================= */

const VERIFICATION_STEPS = [
  {
    num: '01',
    emoji: '😲',
    title: 'Something grabs you',
    short: 'A post makes you angry, scared, or excited. That\'s the first red flag.',
    detail:
      'Emotionally charged content is engineered to bypass your critical thinking. When something makes you feel strongly — especially outrage or fear — pause before you react. The algorithm rewards emotional engagement, not accuracy.',
  },
  {
    num: '02',
    emoji: '🔍',
    title: 'Cross-check the source',
    short: 'Open a different platform. Search the same topic. What do you see?',
    detail:
      'Algorithms tailor results to your history, so switching platforms gives you a fresh slate. If the story only appears in one ecosystem and nowhere else, that\'s a strong signal it may be exaggerated — or outright false.',
  },
  {
    num: '03',
    emoji: '🌐',
    title: 'Change the lens',
    short: 'Search in another language, or read an international outlet. Compare.',
    detail:
      'Language bubbles are some of the most impenetrable. The same event reported in English, Chinese, Arabic, or Spanish can read like four different stories. Even a machine-translated search broadens your view dramatically.',
  },
]

const CHECKLIST_ITEMS = [
  { id: 'c1', emoji: '📱', text: 'I checked news on more than one platform today' },
  { id: 'c2', emoji: '🔍', text: 'I actively searched for information, not just scrolled' },
  { id: 'c3', emoji: '👁️', text: 'I saw content from a perspective different from my own' },
  { id: 'c4', emoji: '🧠', text: 'I distinguished between opinion and verified fact' },
  { id: 'c5', emoji: '✅', text: 'I fact-checked something that surprised me' },
  { id: 'c6', emoji: '💬', text: 'I talked to someone about a piece of information I found' },
]

const CHALLENGE_DAYS = [
  { day: 1, emoji: '👣', title: 'Follow a different voice', desc: 'Find and follow one account whose views differ from yours. Don\'t argue — just listen. Stay for a week.' },
  { day: 2, emoji: '🔀', title: 'Platform hop', desc: 'Pick today\'s biggest headline. Search it on 3 different platforms. Compare what each one shows you.' },
  { day: 3, emoji: '🌍', title: 'Go international', desc: 'Read coverage of your country from an international outlet. Notice what they emphasize that local media doesn\'t.' },
  { day: 4, emoji: '🗣️', title: 'Change the language', desc: 'Use a translator to search a topic you care about in a different language. See what bubbles exist across languages.' },
  { day: 5, emoji: '📵', title: 'Silent scroll', desc: 'Scroll your feed for 10 minutes without liking, sharing, or commenting. Observe what the algorithm shows when you stop giving signals.' },
  { day: 6, emoji: '📊', title: 'Map your week', desc: 'Write down the top 5 stories you encountered this week. Where did each come from? What perspectives were missing?' },
  { day: 7, emoji: '🤝', title: 'Share what you learned', desc: 'Tell a friend or family member about one thing you discovered this week that surprised you. Show them how to do it too.' },
]

/* ================= Hero ================= */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-24 text-center md:py-32">
      {/* 装饰 */}
      <span className="pointer-events-none absolute left-[10%] top-[15%] h-16 w-16 animate-bob rounded-full bg-lagoon/6" />
      <span className="pointer-events-none absolute right-[15%] top-[25%] h-10 w-10 animate-bob-slow rounded-full bg-mint/10" style={{ animationDelay: '1.8s' }} />
      <span className="pointer-events-none absolute bottom-[20%] left-[20%] h-8 w-8 animate-bob rounded-full bg-peach/25" style={{ animationDelay: '3s' }} />

      <h1 className="font-display text-4xl font-extrabold leading-tight text-cocoa sm:text-5xl md:text-7xl">
        Break Out of
        <br />
        <span className="text-lagoon">Your Bubble</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-clay sm:text-xl md:text-2xl">
        You've seen how the algorithm works and where bubbles exist worldwide.
        Now it's time to do something about it — starting today.
      </p>
      <span className="mt-14 inline-block animate-bob text-3xl text-clay/40">↓</span>
    </section>
  )
}

/* ================= 三步交叉验证 ================= */

function VerificationSection() {
  const [active, setActive] = useState(null)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
          🔬 The 3-Step Cross-Check
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-clay">
          Before you believe — or share — anything that triggers an emotional reaction,
          run it through these three steps.
        </p>

        <div className="mt-14 space-y-0">
          {VERIFICATION_STEPS.map((s, i) => {
            const isOpen = active === i
            return (
              <div
                key={i}
                className="border-b border-peach/40 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? null : i)}
                  className="flex w-full items-start gap-5 py-8 text-left transition-colors hover:bg-cream/30 md:gap-8"
                >
                  {/* 编号 */}
                  <span className={`flex-shrink-0 font-display text-5xl font-extrabold transition-colors sm:text-6xl md:text-7xl ${isOpen ? 'text-lagoon' : 'text-peach'}`}>
                    {s.num}
                  </span>
                  {/* 内容 */}
                  <div className="flex-1 pt-2">
                    <span className="text-4xl">{s.emoji}</span>
                    <h3 className="mt-2 font-display text-2xl font-extrabold text-cocoa md:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-lg leading-relaxed text-clay">{s.short}</p>
                  </div>
                  {/* 展开指示器 */}
                  <span className={`flex-shrink-0 pt-4 text-3xl text-clay/40 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>

                {/* 展开详情 */}
                {isOpen && (
                  <div className="animate-post-in pb-8 pl-16 pr-4 md:pl-28">
                    <p className="max-w-2xl text-lg leading-relaxed text-clay">{s.detail}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================= 每日信息检查清单 ================= */

function ChecklistSection() {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem('act_checklist')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('act_checklist', JSON.stringify(checked))
    } catch { /* ignore */ }
  }, [checked])

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev }
      if (next[id]) {
        delete next[id]
      } else {
        next[id] = true
      }
      return next
    })
  }

  const checkedCount = Object.keys(checked).length

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
              ✅ Daily Info Hygiene
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-clay">
              Tiny habits that keep your information diet balanced. Check what you did today.
            </p>
          </div>
          {/* 完成度 —— 统一字体 */}
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="font-display text-4xl font-extrabold text-lagoon sm:text-5xl">
              {checkedCount}
            </span>
            <span className="font-display text-2xl font-extrabold text-clay/50">/</span>
            <span className="font-display text-3xl font-extrabold text-clay/50">
              {CHECKLIST_ITEMS.length}
            </span>
          </div>
        </div>

        <div className="mt-12 space-y-0">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checked[item.id]
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-5 border-b border-peach/40 py-5 text-left transition-all ${
                  isChecked
                    ? 'bg-mint/5 opacity-100'
                    : 'opacity-70 hover:bg-white/30 hover:opacity-90'
                }`}
              >
                {/* 自定义勾选框 */}
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                    isChecked
                      ? 'border-mint bg-mint text-white'
                      : 'border-peach bg-white'
                  }`}
                >
                  {isChecked && '✓'}
                </span>
                <span className="text-3xl">{item.emoji}</span>
                <span
                  className={`text-lg font-bold ${
                    isChecked
                      ? 'text-cocoa/70 line-through decoration-lagoon/40'
                      : 'text-clay'
                  }`}
                >
                  {item.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================= 7 天挑战 ================= */

function ChallengeSection() {
  const [expanded, setExpanded] = useState(null)
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('act_challenge')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('act_challenge', JSON.stringify(completed))
    } catch { /* ignore */ }
  }, [completed])

  const toggleDay = (day) => {
    setExpanded((prev) => (prev === day ? null : day))
  }

  const toggleComplete = (day) => {
    setCompleted((prev) => ({ ...prev, [day]: !prev[day] }))
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
              🗓️ 7-Day Bubble Breaker
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-clay">
              One small action per day. By day 7, your information world will be measurably wider.
            </p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-peach/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lagoon to-mint transition-all duration-700"
            style={{ width: `${(Object.values(completed).filter(Boolean).length / 7) * 100}%` }}
          />
        </div>

        <div className="mt-12 space-y-0">
          {CHALLENGE_DAYS.map((d) => {
            const isOpen = expanded === d.day
            const isDone = !!completed[d.day]
            return (
              <div
                key={d.day}
                className={`border-b border-peach/40 last:border-b-0 transition-colors ${
                  isDone ? 'bg-mint/5' : ''
                }`}
              >
                <div className="flex items-center gap-4 py-6 md:gap-6">
                  {/* 完成勾选框 */}
                  <button
                    type="button"
                    onClick={() => toggleComplete(d.day)}
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isDone
                        ? 'border-mint bg-mint text-white'
                        : 'border-peach bg-white hover:border-lagoon'
                    }`}
                  >
                    {isDone && <span className="text-base">✓</span>}
                  </button>

                  {/* 内容 */}
                  <button
                    type="button"
                    onClick={() => toggleDay(d.day)}
                    className="flex flex-1 items-center gap-4 text-left"
                  >
                    <span className={`font-display text-3xl font-extrabold md:text-4xl ${isDone ? 'text-mint' : 'text-clay/40'}`}>
                      {String(d.day).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{d.emoji}</span>
                        <h3 className={`font-display text-xl font-extrabold md:text-2xl ${isDone ? 'text-cocoa/60' : 'text-cocoa'}`}>
                          {d.title}
                        </h3>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 text-2xl text-clay/40 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                </div>

                {/* 展开 */}
                {isOpen && (
                  <div className="animate-post-in pb-6 pl-16 pr-4 md:pl-20">
                    <p className="max-w-2xl text-lg leading-relaxed text-clay">{d.desc}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================= 我的茧房报告 ================= */

function ReportSection() {
  const [discover, setDiscover] = useState(null)
  const [simulate, setSimulate] = useState(null)

  useEffect(() => {
    try {
      const d = localStorage.getItem('bubble_results')
      const s = localStorage.getItem('simulate_result')
      if (d) setDiscover(JSON.parse(d))
      if (s) setSimulate(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  const hasData = discover || simulate

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
          📋 Your Bubble Report
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-clay">
          A compact snapshot. Screenshot this and share it.
        </p>

        {hasData ? (
          <div className="mt-12 flex justify-center">
            {/* 手机外框 */}
            <div className="w-[310px] rounded-[36px] border-[5px] border-cocoa/15 bg-cocoa p-2 shadow-2xl shadow-cocoa/15">
              {/* 屏幕区域 */}
              <div className="overflow-hidden rounded-[24px] bg-white">
                {/* 状态栏 */}
                <div className="flex items-center justify-between bg-cocoa px-5 py-2.5">
                  <span className="text-[10px] font-bold text-white/50">9:41</span>
                  <span className="text-[10px] font-bold text-white/50">●●●○ Wi-Fi ▮▮▮</span>
                </div>

                {/* 报告头部 */}
                <div className="bg-lagoon px-5 py-5 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Filter Bubble Report
                  </p>
                  <p className="mt-0.5 text-lg font-extrabold leading-tight">Your Information World</p>
                  <p className="mt-1 text-[11px] font-semibold text-white/60">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* 报告内容 —— 紧凑版 */}
                <div className="space-y-0 px-5 py-2">
                  {/* Discover */}
                  {discover && (
                    <>
                      <div className="border-b border-clay/10 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                          🔍 Information Sources
                        </p>
                        <p className="mt-1 text-[13px] font-bold leading-snug text-cocoa">
                          {discover.platforms?.length > 0
                            ? discover.platforms.join('  ·  ')
                            : 'None recorded'}
                        </p>
                      </div>
                      <div className="border-b border-clay/10 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                          📰 Content You Scroll
                        </p>
                        <p className="mt-1 text-[13px] font-bold leading-snug text-cocoa">
                          {discover.types?.length > 0
                            ? discover.types.join('  ·  ')
                            : 'None recorded'}
                        </p>
                      </div>
                      {discover.viewpoint && (
                        <div className="border-b border-clay/10 py-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                            👁️ Viewpoint Exposure
                          </p>
                          <p className="mt-1 text-[13px] font-bold leading-snug text-cocoa">
                            {discover.viewpoint === 'same'
                              ? 'Mostly similar views'
                              : discover.viewpoint === 'mixed'
                                ? 'Mix of perspectives'
                                : 'Varies by topic'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Simulate */}
                  {simulate && (
                    <>
                      <div className="border-b border-clay/10 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                          📱 Simulation Topic
                        </p>
                        <p className="mt-1 text-[13px] font-bold leading-snug text-cocoa">
                          {simulate.topic}
                        </p>
                      </div>
                      <div className="border-b border-clay/10 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                          ⚖️ Feed Bias After 10 Posts
                        </p>
                        {/* 紧凑进度条 */}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-clay/15">
                            <div
                              className="h-full rounded-full bg-lagoon"
                              style={{ width: `${simulate.bias}%` }}
                            />
                          </div>
                          <span className="text-sm font-extrabold text-lagoon">
                            {simulate.bias}%
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-semibold leading-snug text-clay">
                          {simulate.bias < 40
                            ? 'Your feed stayed relatively balanced.'
                            : simulate.bias < 60
                              ? 'Your feed leaned moderately one-sided.'
                              : 'Your feed became heavily one-sided.'}
                        </p>
                      </div>
                      {simulate.mix && (
                        <div className="py-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-clay">
                            📊 Post Mix
                          </p>
                          <p className="mt-1 text-[13px] font-bold leading-snug text-cocoa">
                            Side A: {simulate.mix.A ?? 0}  ·  Side B: {simulate.mix.B ?? 0}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 底部水印 */}
                <div className="bg-clay/5 px-5 py-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-clay/50">
                    mil-hackathon · break your bubble
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 没有数据时 */
          <div className="mt-14 border-b border-peach/40 pb-14">
            <p className="text-xl leading-relaxed text-clay">
              You haven't completed the earlier modules yet.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/discover"
                className="rounded-full bg-lagoon px-8 py-3 text-lg font-bold text-white shadow-lg shadow-lagoon/30 transition-all hover:-translate-y-0.5"
              >
                Try Discover →
              </Link>
              <Link
                to="/simulate"
                className="rounded-full border-2 border-peach bg-white px-8 py-3 text-lg font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon"
              >
                Try Simulate →
              </Link>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm font-semibold text-clay/50">
          💡 Complete both modules above for a full report you can screenshot and share.
        </p>
      </div>
    </section>
  )
}

/* ================= 底部 CTA ================= */

function FooterCTA() {
  return (
    <footer className="bg-cocoa px-6 py-20 text-center">
      <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
        You made it through.
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-clay/80">
        The real work starts now — every scroll, every click, every share is a choice.
        Keep breaking bubbles.
      </p>
      <Link
        to="/"
        className="mt-10 inline-block rounded-full bg-lagoon px-12 py-4 text-xl font-extrabold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60"
      >
        ← Back to Start
      </Link>
      <p className="mt-6 text-sm font-semibold text-clay/40">
        MIL Hackathon · Filter Bubble Project · 2026
      </p>
    </footer>
  )
}

/* ================= 泡泡装饰（随页面滚动 + 可点击戳破） ================= */

function BubbleField() {
  /* 分布在页面两侧，零散不遮挡内容区 */
  const bubbles = [
    { size: 85, left: '1%',  top: '3%',  delay: '0s' },
    { size: 110, left: '3%',  top: '25%', delay: '2s' },
    { size: 65, left: '1%',  top: '50%', delay: '1s' },
    { size: 95, left: '4%',  top: '70%', delay: '3.5s' },
    { size: 75, left: '1%',  top: '88%', delay: '1.5s' },
    { size: 100, left: '88%', top: '8%',  delay: '0.7s' },
    { size: 70, left: '92%', top: '32%', delay: '4s' },
    { size: 115, left: '86%', top: '55%', delay: '2.8s' },
    { size: 80, left: '94%', top: '75%', delay: '5s' },
    { size: 90, left: '90%', top: '92%', delay: '3.2s' },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ zIndex: 10 }}>
      <style>{`
        @keyframes act-bubble-rise {
          0%   { transform: translateY(0) translateX(0); opacity: 0.65; }
          25%  { transform: translateY(-25px) translateX(6px); opacity: 0.75; }
          50%  { transform: translateY(-50px) translateX(-4px); opacity: 0.8; }
          75%  { transform: translateY(-75px) translateX(3px); opacity: 0.7; }
          100% { transform: translateY(-100px) translateX(0); opacity: 0.65; }
        }
        .animate-act-bubble { animation: act-bubble-rise 6s ease-in-out infinite; }
      `}</style>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="pointer-events-auto absolute animate-act-bubble"
          style={{
            left: b.left,
            top: b.top,
            zIndex: 1,
            animationDelay: b.delay,
          }}
        >
          <Bubble3D size={b.size} />
        </div>
      ))}
    </div>
  )
}

/* ================= 主组件 ================= */

export default function Act() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-cream">
      <ProgressBar current="/act" />

      <BubbleField />

      <Hero />

      <VerificationSection />

      <ChecklistSection />

      <ChallengeSection />

      <ReportSection />

      <FooterCTA />
    </div>
  )
}
