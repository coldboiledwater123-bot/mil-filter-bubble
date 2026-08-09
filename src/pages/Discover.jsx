import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import BrandLogo from '../components/BrandLogo'
import Toast from '../components/Toast'

/* ================= 数据 ================= */

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', logo: 'tiktok' },
  { id: 'youtube', name: 'YouTube', logo: 'youtube' },
  { id: 'instagram', name: 'Instagram', logo: 'instagram' },
  { id: 'x', name: 'X', logo: 'x' },
  { id: 'reddit', name: 'Reddit', logo: 'reddit' },
  { id: 'discord', name: 'Discord', logo: 'discord' },
  { id: 'whatsapp', name: 'WhatsApp', logo: 'whatsapp' },
  { id: 'telegram', name: 'Telegram', logo: 'telegram' },
  { id: 'google', name: 'Google', logo: 'google' },
  { id: 'news', name: 'News Apps', emoji: '🗞️' },
  { id: 'podcasts', name: 'Podcasts', logo: 'applepodcasts' },
  { id: 'other', name: 'Other', emoji: '✨' },
]

const CONTENT_TYPES = [
  { id: 'fun', name: 'Fun & gossip', emoji: '🎬' },
  { id: 'local', name: 'Local news', emoji: '🏘️' },
  { id: 'world', name: 'World news', emoji: '🌍' },
  { id: 'tech', name: 'Tech & science', emoji: '💻' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '☕' },
  { id: 'politics', name: 'Politics', emoji: '🗳️' },
  { id: 'deep', name: 'Deep reads', emoji: '📚' },
  { id: 'money', name: 'Money & finance', emoji: '💰' },
  { id: 'sports', name: 'Sports & gaming', emoji: '⚽' },
  { id: 'food', name: 'Food & travel', emoji: '🍜' },
  { id: 'friends', name: 'Friend circles', emoji: '👥' },
]

const VIEWPOINTS = ['All the time', 'Sometimes', 'Rarely', 'Never']

/* ================= 主组件 ================= */

export default function Discover() {
  const [step, setStep] = useState(0) // 0=平台 1=内容 2=结果
  const [platforms, setPlatforms] = useState(new Set())
  const [types, setTypes] = useState(new Set())
  const [viewpoint, setViewpoint] = useState(null)
  const [toast, setToast] = useState(null)

  const toggleSet = (set, item) => {
    const next = new Set(set)
    next.has(item) ? next.delete(item) : next.add(item)
    return next
  }

  const saveResults = () => {
    try {
      localStorage.setItem(
        'bubble_results',
        JSON.stringify({
          platforms: [...platforms],
          types: [...types],
          viewpoint,
        }),
      )
    } catch {
      /* localStorage 不可用时静默跳过 */
    }
  }

  /** 下一步：带彩蛋判断（俏皮话 toast，不阻塞正常流程） */
  const goNext = () => {
    if (step === 0) {
      if (platforms.size === 0) {
        // 彩蛋①：什么都不选
        setToast(
          'ZERO apps?! Extremely brave. Go live life — the real world has better graphics anyway. 🌍',
        )
        return // 不前进，直到选至少一个
      }
      if (platforms.size === PLATFORMS.length) {
        // 彩蛋②：全选
        setToast('ALL of them?! Certified media glutton. Your thumb deserves a raise. 🏆')
      }
      saveResults()
      setStep(1)
      return
    }

    // step 1：内容 + 观点彩蛋
    if (types.size === 1 && viewpoint === 'Never') {
      // 彩蛋⑤：最窄茧房
      setToast('Sealed shut AND proud? Your bubble now has its own zip code. 📦')
    } else if (types.size === 1) {
      // 彩蛋④：只选一类
      setToast('ONE topic?! Commitment! The world has like ten more, you know. 🤏')
    }
    saveResults()
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-cream">
      <ProgressBar current="/discover" />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 md:px-10 md:py-12">
        {/* 步骤标题 */}
        {step < 2 ? (
          <div className="mb-10 text-center">
            <div className="text-base font-bold uppercase tracking-widest text-lagoon">
              Step {step + 1} of 3
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-cocoa sm:text-4xl md:text-5xl">
              {step === 0
                ? 'Where do you get your info?'
                : 'What do you mostly scroll?'}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-clay sm:text-xl">
              {step === 0
                ? 'Pick the platforms you use most. (3–5 is typical)'
                : 'Pick the kinds of content you saw this week.'}
            </p>
          </div>
        ) : (
          <ResultView
            platforms={platforms}
            types={types}
            viewpoint={viewpoint}
          />
        )}

        {/* Step 1：平台选择 */}
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
              {PLATFORMS.map((p) => (
                <PickCard
                  key={p.id}
                  logo={p.logo}
                  emoji={p.emoji}
                  label={p.name}
                  selected={platforms.has(p.id)}
                  onClick={() => setPlatforms((s) => toggleSet(s, p.id))}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-semibold text-clay">
              {platforms.size === 0
                ? 'Pick at least one to continue'
                : `${platforms.size} selected`}
            </p>
          </>
        )}

        {/* Step 2：内容类型 + 观点问题 */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-3">
              {CONTENT_TYPES.map((t) => (
                <PickCard
                  key={t.id}
                  emoji={t.emoji}
                  label={t.name}
                  selected={types.has(t.id)}
                  onClick={() => setTypes((s) => toggleSet(s, t.id))}
                />
              ))}
            </div>

            {/* 观点问题 */}
            <div className="mt-12 rounded-3xl border-2 border-peach bg-white p-5 sm:p-8">
              <h2 className="text-center font-display text-xl font-extrabold text-cocoa sm:text-2xl">
                One more thing…
              </h2>
              <p className="mt-2 text-center text-lg text-clay">
                In your feed, do you see opinions you disagree with?
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {VIEWPOINTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setViewpoint(v)}
                    className={`rounded-full px-5 py-2.5 text-base font-bold transition-all sm:px-8 sm:py-3 sm:text-lg ${
                      viewpoint === v
                        ? 'bg-lagoon text-white shadow-lg shadow-lagoon/30'
                        : 'bg-cream text-clay hover:bg-peach/60'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 底部导航 */}
        <div className="mt-12 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-full border-2 border-peach bg-white px-6 py-3 text-base font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-10 sm:py-3.5 sm:text-lg"
            >
              ← Back
            </button>
          ) : (
            <Link
              to="/"
              className="rounded-full border-2 border-peach bg-white px-6 py-3 text-base font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-10 sm:py-3.5 sm:text-lg"
            >
              ← Back
            </Link>
          )}

          {step < 2 && (
            <button
              type="button"
              onClick={goNext}
              disabled={step === 1 && (types.size === 0 || !viewpoint)}
              className="rounded-full bg-lagoon px-8 py-3.5 text-lg font-bold text-white shadow-xl shadow-lagoon/30 transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lagoon/50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-12 sm:py-4 sm:text-xl"
            >
              {step === 0 ? 'Next: What do you see →' : 'See my bubble →'}
            </button>
          )}
        </div>
      </main>

      <Toast text={toast} onClose={() => setToast(null)} />
    </div>
  )
}

/* ================= 选择卡片 ================= */

function PickCard({ emoji, logo, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all sm:gap-3 sm:rounded-3xl sm:p-6 ${
        selected
          ? 'border-lagoon bg-lagoon/10 shadow-lg shadow-lagoon/20'
          : 'border-peach bg-white hover:border-lagoon/50 hover:shadow-md'
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-lagoon text-sm font-bold text-white">
          ✓
        </span>
      )}
      {logo ? (
        <BrandLogo
          id={logo}
          brand={!selected}
          className={`h-9 w-9 sm:h-11 sm:w-11 ${selected ? 'text-lagoon' : ''}`}
        />
      ) : (
        <span className="text-3xl sm:text-4xl">{emoji}</span>
      )}
      <span className={`text-lg font-bold sm:text-lg ${selected ? 'text-lagoon' : 'text-cocoa'}`}>
        {label}
      </span>
    </button>
  )
}

/* ================= 结果视图 ================= */

function ResultView({ platforms, types, viewpoint }) {
  const coverage = Math.round((types.size / CONTENT_TYPES.length) * 100)
  const sources = Math.round((platforms.size / PLATFORMS.length) * 100)
  const viewpointScore =
    viewpoint === 'All the time' ? 100 : viewpoint === 'Sometimes' ? 66 : viewpoint === 'Rarely' ? 33 : 0
  const total = Math.round(coverage * 0.4 + sources * 0.3 + viewpointScore * 0.3)

  // 彩蛋判断：超人（全选 + 常刷到对立观点）& 密室（一类 + 从不看对立观点）
  const isSuperhuman =
    types.size === CONTENT_TYPES.length && viewpoint === 'All the time'
  const isSealed = types.size === 1 && viewpoint === 'Never'

  let verdict = { title: 'Wide open 🌤️', desc: 'Your bubble is nearly transparent. You see far — keep it that way!' }
  if (isSuperhuman) {
    verdict = {
      title: 'Ultra-wide open 🌈',
      desc: 'You see every topic and every side. Not a bubble — a skylight. The algorithm has nothing on you.',
    }
  } else if (isSealed) {
    verdict = {
      title: 'Sealed shut 📦',
      desc: 'One topic, zero disagreement. Your bubble has its own zip code.',
    }
  } else if (total < 40) {
    verdict = { title: 'Cozy 🫧', desc: 'Your bubble is cozy… and a little lonely. There is a whole world outside.' }
  } else if (total < 70) {
    verdict = { title: 'Half-open 🪟', desc: 'Your bubble has a window. Nice — but the walls are still there.' }
  }

  const coverageText =
    coverage >= 70
      ? 'You sample almost every topic. Great range!'
      : coverage >= 40
        ? 'You wander across topics — but some shelves stay dark.'
        : 'You mostly stay in a few topics. Whole shelves of info are invisible to you.'

  const sourceText =
    platforms.size === 1
      ? 'One platform runs your info world. That is a lot of power for one app.'
      : platforms.size <= 3
        ? 'A handful of apps feed you. They may share the same algorithm mood.'
        : 'You spread your info across many sources. Harder to trap.'

  const viewpointText = {
    'All the time': 'You see opposing views regularly — your bubble has holes (good ones!).',
    Sometimes: 'You meet opposing views now and then.',
    Rarely: 'You mostly see people who agree with you. Careful out there.',
    Never: 'You never see disagreement. Your bubble is sealed shut.',
  }[viewpoint]

  return (
    <div className="text-center">
      <div className="text-base font-bold uppercase tracking-widest text-lagoon">
        Step 3 of 3
      </div>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-cocoa sm:text-4xl md:text-5xl">
        Here's your bubble
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-clay sm:text-xl">
        Your bubble is <span className="font-bold text-cocoa">{verdict.title}</span>
      </p>
      <p className="mx-auto mt-2 max-w-xl text-lg leading-relaxed text-clay sm:text-xl">{verdict.desc}</p>

      {/* 彩蛋③：超人横幅（居中显眼） */}
      {isSuperhuman && (
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-gradient-to-r from-rose-400 via-amber-400 to-lagoon p-1 shadow-2xl shadow-rose-400/30">
          <div className="rounded-[calc(1.5rem-4px)] bg-white/95 px-8 py-7">
            <div className="text-5xl">🦸</div>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-cocoa">
              SUPERHUMAN DETECTED
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-clay">
              You read EVERYTHING and still see opposing views all the time.
              That's not a media diet — that's media omnivorism. The algorithm is
              officially terrified of you.
            </p>
          </div>
        </div>
      )}

      {/* 三个指标 */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <MetricRing
          pct={coverage}
          label="Topic coverage"
          detail={coverageText}
        />
        <MetricRing
          pct={sources}
          label="Source spread"
          detail={sourceText}
        />
        <MetricRing
          pct={viewpointScore}
          label="Opposing views"
          detail={viewpointText}
        />
      </div>

      {/* 结束 CTA */}
      <div className="mt-14">
        <Link
          to="/simulate"
          className="inline-block rounded-full bg-lagoon px-10 py-4 text-xl font-bold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60 sm:px-14 sm:py-5 sm:text-2xl"
        >
          See how this happens →
        </Link>
        <p className="mt-4 text-base font-semibold text-clay">
          Your feed narrows itself. You'll feel it in the next step.
        </p>
      </div>
    </div>
  )
}

/** 圆环指标 */
function MetricRing({ pct, label, detail }) {
  return (
    <div className="rounded-3xl border-2 border-peach bg-white p-5 text-center sm:p-8">
      <div
        className="mx-auto flex h-28 w-28 items-center justify-center rounded-full sm:h-36 sm:w-36"
        style={{
          background: `conic-gradient(#14b8d6 ${pct}%, #e8f4fa ${pct}% 100%)`,
        }}
      >
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white sm:h-26 sm:w-26">
          <span className="text-2xl font-extrabold text-cocoa sm:text-3xl">{pct}%</span>
          <span className="text-xs font-bold text-clay">open</span>
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-extrabold text-cocoa sm:mt-5 sm:text-2xl">{label}</h3>
      <p className="mt-2 text-base leading-relaxed text-clay">{detail}</p>
    </div>
  )
}
