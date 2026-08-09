import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Bubble3D from '../components/Bubble3D'
import Ballpit from '../components/Ballpit'

/* ================= 数据：全球信息茧房案例 ================= */

const REGIONS = [
  {
    id: 'east-asia',
    emoji: '🌏',
    name: 'East Asia',
    subtitle: '东亚',
    gradient: 'from-lagoon/25 via-peach/60 to-cream',
    placeholderEmoji: '🏯',
    bannerImg: '/images/east-asia-osaka.jpg',
    cases: [
      {
        emoji: '💼',
        title: 'Employment Pressure',
        chinese: '就业压力',
        img: '/images/east-asia-tokyo.jpg',
        desc: 'In Japan and South Korea, job-seeking platforms build algorithmic tunnels — search for one industry, and the algorithm stops showing alternatives. University graduates scroll through feeds where only certain career paths seem to exist, while entire sectors remain invisible.',
      },
      {
        emoji: '⚡',
        title: 'Gender Polarization',
        chinese: '性别对立',
        img: '/images/generic-people-road.jpg',
        desc: 'On Chinese and Korean social platforms, gender-related content triggers the highest engagement. Algorithms amplify the most polarized takes — nuanced debates become viral battlefields where each side only sees the most extreme 1%.',
      },
      {
        emoji: '👨‍👩‍👧',
        title: 'Generational Divide',
        chinese: '亲子冲突',
        img: '/images/east-asia-seoul.jpg',
        desc: 'Parents receive traditional-values content through WeChat and LINE, while teenagers scroll through progressive peer circles on TikTok and Bilibili. Two family members, same house, completely different realities.',
      },
    ],
  },
  {
    id: 'middle-east',
    emoji: '🕌',
    name: 'Middle East',
    subtitle: '中东',
    gradient: 'from-mint/20 via-peach/55 to-lagoon/15',
    placeholderEmoji: '🕌',
    bannerImg: '/images/middle-east-dubai.jpg',
    cases: [
      {
        emoji: '🗞️',
        title: 'Sectarian Polarization',
        chinese: '宗教与政治极化',
        img: '/images/middle-east-istanbul.jpg',
        desc: 'Across the Middle East, news feeds split sharply along sectarian and political lines. Arabic-language and English-language media often report the same event so differently they might as well be describing different incidents.',
      },
      {
        emoji: '🔤',
        title: 'The Language Wall',
        chinese: '语言壁垒',
        img: '/images/middle-east-samarkand.jpg',
        desc: 'English-educated elites and Arabic-speaking populations inhabit entirely different information ecosystems. Each language group gets recommended content only within its own linguistic bubble.',
      },
      {
        emoji: '🚫',
        title: 'Censorship & Self-Censorship',
        chinese: '审查与自我审查',
        img: '/images/middle-east-petra.jpg',
        desc: 'The visible spectrum of opinion narrows not just because content is removed, but because people learn what not to search for. The most effective filter bubbles are the ones you build inside your own head.',
      },
    ],
  },
  {
    id: 'southeast-asia',
    emoji: '🌴',
    name: 'Southeast Asia',
    subtitle: '东南亚',
    gradient: 'from-lagoon/15 via-mint/30 to-peach/45',
    placeholderEmoji: '🏝️',
    bannerImg: '/images/sea-temple.jpg',
    cases: [
      {
        emoji: '🗳️',
        title: 'Cross-Border Political Bubbles',
        chinese: '跨境政治信息茧房',
        img: '/images/case-protest.jpg',
        desc: 'From Thailand to Indonesia, social media algorithms have become election battlegrounds. Each candidate\'s supporters are sealed into separate information universes — many voters never see a single post from the opposing side.',
      },
      {
        emoji: '📱',
        title: 'Mobile-First Misinformation',
        chinese: '移动端谣言传播',
        img: '/images/sea-varanasi.jpg',
        desc: 'Short-form video algorithms optimize purely for watch time — sensational falsehoods routinely outperform dry facts by 3×. WhatsApp and Telegram chains spread unchecked rumors in languages automated fact-checking barely supports.',
      },
      {
        emoji: '💰',
        title: 'Economic Information Gap',
        chinese: '经济信息鸿沟',
        img: '/images/generic-skyscrapers.jpg',
        desc: 'Urban professionals scroll through LinkedIn feeds about tech salaries; rural populations rely on WhatsApp forwards about crop prices. Two populations, one country, zero shared information.',
      },
    ],
  },
  {
    id: 'europe',
    emoji: '🏛️',
    name: 'Europe',
    subtitle: '欧洲',
    gradient: 'from-peach/40 via-lagoon/18 to-cream',
    placeholderEmoji: '🏰',
    bannerImg: '/images/europe-prague.jpg',
    cases: [
      {
        emoji: '🧱',
        title: 'Immigration Debate Echo Chambers',
        chinese: '移民辩论回音室',
        img: '/images/europe-netherlands.jpg',
        desc: 'Across Germany, France, and Sweden, immigration policy debates are algorithmically split into non-overlapping camps. Neither feed is completely wrong — but neither is the full picture.',
      },
      {
        emoji: '🇪🇺',
        title: 'EU Policy Fragmentation',
        chinese: '欧盟政策信息碎片化',
        img: '/images/europe-frankfurt.jpg',
        desc: 'EU-level decisions affect 450 million people, but coverage is fragmented across 24 official languages. The policy is one document; the information bubbles around it are two dozen separate realities.',
      },
      {
        emoji: '📡',
        title: 'Narrative Divergence on Ukraine',
        chinese: '乌克兰战争叙事分化',
        img: '/images/europe-florence.jpg',
        desc: 'The same military development is framed as victory, defeat, or propaganda depending on which side of the algorithmic divide you sit on. Geography used to determine what news you received; now your watch history does.',
      },
    ],
  },
  {
    id: 'usa',
    emoji: '🗽',
    name: 'United States',
    subtitle: '美国',
    gradient: 'from-lagoon/20 via-peach/35 to-mint/18',
    placeholderEmoji: '🦅',
    bannerImg: '/images/usa-philadelphia.jpg',
    cases: [
      {
        emoji: '🟦🟥',
        title: 'Left-Right Political Polarization',
        chinese: '左右政治极化',
        img: '/images/case-divide-sign.jpg',
        desc: 'A Democrat and a Republican searching the same keywords get completely different results, sources, and "facts." Two Americans can experience the same news day and come away with two incompatible versions of reality.',
      },
      {
        emoji: '📰',
        title: 'Local News Deserts',
        chinese: '地方新闻荒漠',
        img: '/images/generic-newspaper.jpg',
        desc: 'Over 2,000 American counties have no local newspaper. Social media algorithms fill the void — but they\'re optimized for national outrage, not local information.',
      },
      {
        emoji: '🗓️',
        title: 'Election Cycle Amplification',
        chinese: '选举周期放大效应',
        img: '/images/case-democracy.jpg',
        desc: 'False political stories spread six times faster than true ones — not because people prefer lies, but because lies are engineered to trigger precisely the emotions algorithms are programmed to reward.',
      },
    ],
  },
]

/* ================= Hero 区 ================= */

function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
      {/* 背景装饰 —— 大小不一的浮动泡泡 */}
      <span className="pointer-events-none absolute left-[8%] top-[12%] h-20 w-20 animate-bob rounded-full bg-lagoon/5" />
      <span className="pointer-events-none absolute left-[30%] top-[18%] h-6 w-6 animate-bob-slow rounded-full bg-mint/15" style={{ animationDelay: '0.8s' }} />
      <span className="pointer-events-none absolute left-[12%] top-[35%] h-10 w-10 animate-bob rounded-full bg-peach/25" style={{ animationDelay: '2s' }} />
      <span className="pointer-events-none absolute left-[18%] bottom-[28%] h-14 w-14 animate-bob-slow rounded-full bg-lagoon/7" style={{ animationDelay: '1.2s' }} />

      <span className="pointer-events-none absolute right-[10%] top-[15%] h-16 w-16 animate-bob-slow rounded-full bg-mint/8" style={{ animationDelay: '2.5s' }} />
      <span className="pointer-events-none absolute right-[28%] top-[28%] h-8 w-8 animate-bob rounded-full bg-lagoon/10" style={{ animationDelay: '3.5s' }} />
      <span className="pointer-events-none absolute right-[14%] bottom-[20%] h-24 w-24 animate-bob rounded-full bg-peach/15" style={{ animationDelay: '1.7s' }} />
      <span className="pointer-events-none absolute right-[32%] bottom-[35%] h-5 w-5 animate-bob-slow rounded-full bg-mint/20" />

      {/* 环形装饰 */}
      <span className="pointer-events-none absolute left-[42%] top-[45%] h-32 w-32 animate-bob-slow rounded-full border-2 border-lagoon/8" style={{ animationDelay: '4s' }} />
      <span className="pointer-events-none absolute right-[38%] bottom-[30%] h-24 w-24 animate-bob rounded-full border border-mint/10" style={{ animationDelay: '2.2s' }} />

      {/* 浅色 3D 泡泡 */}
      <Bubble3D size={180} className="mb-4" />

      {/* 标题 */}
      <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-cocoa sm:text-5xl md:text-7xl">
        Filter Bubbles
        <br />
        <span className="text-lagoon">Are Everywhere</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-clay sm:text-xl md:text-2xl">
        The simulation you experienced isn't hypothetical. From Beijing to Berlin, from
        Cairo to Chicago — algorithms shape what entire communities see.
      </p>

      {/* 向下提示 */}
      <span className="mt-14 animate-bob text-3xl text-clay/40">↓</span>
    </section>
  )
}

/* ================= 3D 轮播卡片（JS 驱动无缝循环） ================= */

function RegionCarousel({ regions, activeId, onSelect }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)
  const doubled = [...regions, ...regions]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const speed = 0.7 // px/frame @60fps ≈ 42px/s

    const animate = () => {
      if (!pausedRef.current) {
        offsetRef.current -= speed
        // 滚动过半即归零，实现无缝循环
        if (offsetRef.current <= -(track.scrollWidth / 2)) {
          offsetRef.current = 0
        }
        track.style.transform = `translateX(${offsetRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handlePause = () => { pausedRef.current = true }
  const handleResume = () => { pausedRef.current = false }

  return (
    <section className="py-16 md:py-20">
      <div className="text-center">
        <h2 className="font-display text-4xl font-extrabold text-cocoa md:text-5xl">
          🌍 Real Bubbles, Worldwide
        </h2>
        <p className="mt-4 text-xl leading-relaxed text-clay">
          Each region tells a different story. Click one to dive in.
        </p>
      </div>

      {/* 轮播轨道 */}
      <div
        className="carousel-viewport mt-12 overflow-hidden py-8"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-10"
          style={{ paddingLeft: 'calc(50vw - 140px)', paddingRight: 'calc(50vw - 140px)' }}
        >
          {doubled.map((r, i) => {
            const isActive = r.id === activeId
            return (
              <button
                key={`${r.id}-${i}`}
                type="button"
                onClick={() => onSelect(r.id)}
                className={`carousel-card group/card relative h-[380px] w-[280px] flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-500 ease-out
                  ${isActive
                    ? 'z-10 scale-105 shadow-2xl shadow-lagoon/25 ring-[5px] ring-lagoon ring-offset-4 ring-offset-cream'
                    : 'z-10 hover:z-20'
                  }
                `}
              >
                {/* 占位图背景 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient}`}>
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(34,51,59,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34,51,59,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '22px 22px',
                    }}
                  />
                </div>

                {/* 内容覆盖层 */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <span className="text-8xl drop-shadow-md transition-transform group-hover/card:scale-110">
                    {r.placeholderEmoji}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold text-cocoa">
                    {r.name}
                  </h3>
                  <span className="mt-1 text-lg font-bold text-clay">{r.subtitle}</span>
                </div>

                {/* 底部 hover 提示 */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-cocoa/55 to-transparent p-5 pt-14 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <span className="text-base font-bold text-white">
                    {isActive ? '✓ Selected' : 'Click to explore →'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-2 text-center text-base font-semibold text-clay/60">
        🖱️ Hover to pause · Click a card to explore
      </p>
    </section>
  )
}

/* ================= 地区案例详情 ================= */

function RegionDetail({ region }) {
  const detailRef = useRef(null)

  useEffect(() => {
    if (region && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [region?.id])

  return (
    <section
      ref={detailRef}
      id="region-detail"
      className="min-h-[60vh] bg-white py-20 transition-all duration-700 md:py-28"
    >
      {region ? (
        <div>
          {/* 顶部横幅图 */}
          <div className="mx-auto max-w-6xl overflow-hidden px-6 md:px-8">
            <div className="relative aspect-[21/7] w-full overflow-hidden">
              <img
                src={region.bannerImg}
                alt={`${region.name} landscape`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
            </div>
          </div>

          {/* 地区标题 */}
          <div className="mx-auto mt-12 flex max-w-4xl items-baseline gap-4 px-6 md:px-8">
            <span className="text-5xl">{region.emoji}</span>
            <div>
              <h2 className="font-display text-4xl font-extrabold text-cocoa md:text-5xl">
                {region.name}
              </h2>
              <p className="mt-1 text-xl font-bold text-clay">{region.subtitle}</p>
            </div>
          </div>

          {/* 3 个案例 —— 交替分栏排版，无卡片 */}
          <div className="mx-auto mt-16 max-w-4xl space-y-0 px-6 md:px-8">
            {region.cases.map((c, i) => {
              const isReversed = i % 2 === 1
              return (
                <div
                  key={i}
                  className={`group flex flex-col gap-8 border-b border-peach/40 py-12 last:border-b-0 md:flex-row md:gap-12 ${
                    isReversed ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* 图片区 */}
                  <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden md:w-72">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* 文案区 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.emoji}</span>
                      <div>
                        <h3 className="font-display text-xl font-extrabold text-cocoa transition-colors group-hover:text-lagoon md:text-2xl">
                          {c.title}
                        </h3>
                        <span className="text-sm font-bold text-lagoon/70">{c.chinese}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-clay">{c.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* 未选中时 */
        <div className="flex flex-col items-center justify-center py-24">
          <span className="text-8xl animate-bob">👆</span>
          <p className="mt-8 font-display text-3xl font-extrabold text-cocoa/50">
            Pick a region card above
          </p>
          <p className="mt-3 text-lg leading-relaxed text-clay/60">
            Discover how filter bubbles shape realities around the world
          </p>
        </div>
      )}
    </section>
  )
}

/* ================= 联系我们 ================= */

function ContactFooter() {
  return (
    <footer className="bg-cocoa px-6 py-20 text-center md:py-28">
      <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl">
        Get in Touch
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-clay/80">
        Have a story about filter bubbles in your region? Want to collaborate? We'd love
        to hear from you.
      </p>

      {/* 邮箱 */}
      <a
        href="mailto:coldboiledwater123@gmail.com"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-base font-bold text-lagoon backdrop-blur-sm transition-all hover:bg-white/20 hover:text-mint sm:px-8 sm:text-lg"
      >
        <span className="text-xl">✉️</span>
        coldboiledwater123@gmail.com
      </a>

      <p className="mt-6 text-base font-semibold text-clay/50">
        We read every message. Response within 48 hours.
      </p>

      {/* 底部 CTA 跳转 Act */}
      <div className="mt-16">
        <Link
          to="/act"
          className="inline-block rounded-full bg-lagoon px-14 py-5 text-2xl font-extrabold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60"
        >
          Ready to act? →
        </Link>
        <p className="mt-4 text-sm font-semibold text-clay/50">
          Tools, checklists, and a 7-day challenge — all free.
        </p>
      </div>
    </footer>
  )
}

/* ================= 全球数据横幅 ================= */

const GLOBAL_STATS = [
  { number: '6×', label: 'False news spreads faster than truth', detail: 'MIT study, Science 2018' },
  { number: '2,000+', label: 'US counties with no local newspaper', detail: 'Local news deserts across America' },
  { number: '70%', label: 'People get news from social media', detail: 'Pew Research, global survey' },
  { number: '24', label: 'Official EU languages', detail: 'Same policy, two dozen separate realities' },
]

function StatsBanner() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      {/* 背景装饰 */}
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-lagoon/5" />
      <span className="pointer-events-none absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-mint/6" />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <h2 className="text-center font-display text-3xl font-extrabold text-cocoa md:text-4xl">
          📊 The Numbers Don't Lie
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-lg leading-relaxed text-clay">
          Decades of research show filter bubbles aren't just a theory — they shape elections, health, and relationships.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {GLOBAL_STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-4xl font-extrabold text-lagoon sm:text-6xl md:text-7xl">
                {s.number}
              </div>
              <p className="mt-3 text-lg font-bold leading-tight text-cocoa">{s.label}</p>
              <p className="mt-2 text-sm font-semibold text-clay/60">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= 算法如何运作 ================= */

const ALGORITHM_STEPS = [
  {
    step: '01',
    emoji: '👆',
    title: 'You engage',
    desc: 'Every like, skip, share, and watch tells the algorithm what keeps you scrolling. It builds a model of you in milliseconds.',
  },
  {
    step: '02',
    emoji: '🔧',
    title: 'The feed adapts',
    desc: 'The algorithm shows more of what you engage with and hides what you ignore. Your feed becomes a mirror of your past clicks.',
  },
  {
    step: '03',
    emoji: '🔒',
    title: 'The world narrows',
    desc: 'Opposing views, alternative sources, and inconvenient facts quietly disappear. You don\'t notice — the change is gradual and invisible.',
  },
]

function AlgorithmHow() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
          🧠 How Algorithms Build Your Bubble
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-clay">
          Three steps. That's all it takes for an algorithm to reshape what you see.
        </p>

        <div className="mt-16 space-y-0">
          {ALGORITHM_STEPS.map((s, i) => (
            <div
              key={i}
              className="group flex items-start gap-8 border-b border-peach/50 py-10 last:border-b-0 md:gap-14"
            >
              {/* 左侧：大编号 */}
              <span className="flex-shrink-0 font-display text-7xl font-extrabold text-lagoon/10 transition-colors group-hover:text-lagoon/20 md:text-8xl">
                {s.step}
              </span>
              {/* 右侧：内容 */}
              <div className="pt-3">
                <span className="text-4xl">{s.emoji}</span>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-cocoa md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-clay">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= 信息茧房的代价 ================= */

const IMPACTS = [
  {
    emoji: '🗳️',
    title: 'Democracy',
    desc: 'When voters in the same election live in separate information universes, they can\'t agree on basic facts — let alone debate solutions. Polarized feeds produce polarized electorates.',
  },
  {
    emoji: '💔',
    title: 'Relationships',
    desc: 'Families and friendships crack under the weight of algorithmically-amplified divisions. Two people who love each other can end up believing the other lives in a fantasy world — and the algorithm profits from the fight.',
  },
  {
    emoji: '🏥',
    title: 'Public Health',
    desc: 'During COVID-19, misinformation spread through isolated bubbles cost lives. People in different information ecosystems made radically different health decisions based on the same science — filtered through different algorithms.',
  },
]

function ImpactSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <h2 className="font-display text-3xl font-extrabold text-cocoa md:text-4xl">
          ⚡ The Real Cost
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-clay">
          Filter bubbles aren't just abstract — they have measurable consequences worldwide.
        </p>

        <div className="mt-14 space-y-0">
          {IMPACTS.map((item, i) => (
            <div
              key={i}
              className={`group flex flex-col gap-5 border-b border-peach/50 py-10 last:border-b-0 md:flex-row md:gap-12 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* 标签区 */}
              <div className="flex-shrink-0 md:w-48">
                <span className="text-5xl">{item.emoji}</span>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-cocoa transition-colors group-hover:text-lagoon md:text-3xl">
                  {item.title}
                </h3>
              </div>
              {/* 描述区 */}
              <p className="max-w-xl pt-1 text-lg leading-relaxed text-clay md:pt-3">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= 主组件 ================= */

export default function Info() {
  const [activeRegion, setActiveRegion] = useState(null)

  // 全局平滑滚动
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-cream">
      {/* 球池背景 —— 浅色透明球，固定层 */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
        <Ballpit
          count={80}
          colors={[0xd4eaf7, 0xb8e6d8, 0xf0d4e8]}
          minSize={0.3}
          maxSize={0.8}
          gravity={0.3}
          followCursor={false}
        />
      </div>

      <ProgressBar current="/info" />

      {/* 3D 卡片轮播专用 CSS */}
      <style>{`
        .carousel-card {
          transform: perspective(1000px) rotateY(-14deg) translateZ(0);
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.18),
            0 6px 16px rgba(0, 0, 0, 0.10),
            0 2px 6px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        .carousel-card:hover {
          transform: perspective(1000px) rotateY(0deg) translateZ(35px) scale(1.06);
          box-shadow:
            0 32px 80px rgba(20, 184, 214, 0.40),
            0 16px 48px rgba(0, 0, 0, 0.22),
            0 6px 16px rgba(20, 184, 214, 0.20),
            0 2px 6px rgba(0, 0, 0, 0.10);
        }
        .carousel-card.ring-\\[5px\\]:ring-lagoon {
          transform: perspective(1000px) rotateY(0deg) scale(1.05);
          box-shadow:
            0 0 0 6px rgba(20, 184, 214, 0.35),
            0 32px 80px rgba(20, 184, 214, 0.45),
            0 16px 48px rgba(0, 0, 0, 0.25),
            0 6px 16px rgba(20, 184, 214, 0.25);
        }
        .carousel-viewport {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
        }
      `}</style>

      <Hero />

      <StatsBanner />

      <RegionCarousel regions={REGIONS} activeId={activeRegion} onSelect={setActiveRegion} />

      <RegionDetail region={activeRegion ? REGIONS.find((r) => r.id === activeRegion) : null} />

      <AlgorithmHow />

      <ImpactSection />

      <ContactFooter />
    </div>
  )
}
