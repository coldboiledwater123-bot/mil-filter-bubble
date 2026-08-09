import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import PhoneMockup from '../components/PhoneMockup'
import Toast from '../components/Toast'

/* ================= 常量 ================= */

const FEED_LENGTH = 10 // 信息流帖子数（12 个帖池，保证每边都有"隐藏"内容）

/** 帖子池：每个话题两组对立观点（sideA / sideB），各 6 条 */
const TOPICS = {
  ai: {
    emoji: '🤖',
    name: 'AI & Technology',
    tagline: 'Smart machines are rewriting work, school, and everyday life.',
    sides: {
      A: [
        { id: 'ai-a1', emoji: '💻', author: 'Ava', text: 'AI is writing code next to me. I learn faster with it than in any course.', likes: '12.4k', comments: '342' },
        { id: 'ai-a2', emoji: '🏥', author: 'Sam', text: 'Doctors in my city use AI to spot lung cancer earlier. It saves lives.', likes: '8.1k', comments: '197' },
        { id: 'ai-a3', emoji: '🎓', author: 'Mia', text: 'A kid in a small town learned 3 languages with a free AI tutor.', likes: '5.6k', comments: '88' },
        { id: 'ai-a4', emoji: '🌙', author: 'Zed', text: 'Chatbots never sleep. My 3am questions finally get answers.', likes: '3.2k', comments: '64' },
        { id: 'ai-a5', emoji: '💼', author: 'Lina', text: 'Every new tech creates jobs we cannot imagine yet. The internet did.', likes: '9.7k', comments: '451' },
        { id: 'ai-a6', emoji: '🎨', author: 'Theo', text: 'AI sketched the first 50 characters of my game in one weekend.', likes: '4.4k', comments: '102' },
      ],
      B: [
        { id: 'ai-b1', emoji: '💼', author: 'Nora', text: 'Half of office jobs could change in 10 years. Nobody knows what we do next.', likes: '14.2k', comments: '723' },
        { id: 'ai-b2', emoji: '🕵️', author: 'Rex', text: 'AI reads your messages, photos, and habits — and keeps the data forever.', likes: '11.8k', comments: '534' },
        { id: 'ai-b3', emoji: '🎭', author: 'Ivy', text: 'Deepfakes are getting good. Soon nobody can tell what is real.', likes: '10.1k', comments: '402' },
        { id: 'ai-b4', emoji: '📝', author: 'Kai', text: 'AI grades essays now. Teachers worry it quietly decides kids’ futures.', likes: '6.9k', comments: '287' },
        { id: 'ai-b5', emoji: '⚖️', author: 'Zoe', text: 'If the data is biased, the AI is biased. Machines learn our worst habits.', likes: '9.3k', comments: '318' },
        { id: 'ai-b6', emoji: '📰', author: 'Leo', text: 'Bots push fake stories faster than humans can correct them.', likes: '7.5k', comments: '265' },
      ],
    },
  },
  climate: {
    emoji: '🌍',
    name: 'Climate & Planet',
    tagline: 'The planet is heating up. Who moves the needle — me, or the system?',
    sides: {
      A: [
        { id: 'cl-a1', emoji: '♻️', author: 'Mia', text: 'One family cut their plastic waste by 80% — in a single month.', likes: '6.8k', comments: '214' },
        { id: 'cl-a2', emoji: '🌳', author: 'Sam', text: 'We planted 200 trees in our park. The street is noticeably cooler.', likes: '5.2k', comments: '143' },
        { id: 'cl-a3', emoji: '🚲', author: 'Ava', text: 'I bike instead of driving: 1.5 tons of CO₂ saved a year. It feels good.', likes: '4.1k', comments: '97' },
        { id: 'cl-a4', emoji: '☀️', author: 'Theo', text: 'My rooftop solar now powers my whole house. Bills went to zero.', likes: '7.7k', comments: '301' },
        { id: 'cl-a5', emoji: '👗', author: 'Lina', text: 'Second-hand fashion is trending. Cheaper AND kinder to the planet.', likes: '3.9k', comments: '76' },
        { id: 'cl-a6', emoji: '🌱', author: 'Nora', text: 'Small habits × 8 billion people = a real difference. Every straw counts.', likes: '8.9k', comments: '412' },
      ],
      B: [
        { id: 'cl-b1', emoji: '🏭', author: 'Rex', text: '100 companies make 70% of global emissions. My recycling is a drop.', likes: '15.3k', comments: '846' },
        { id: 'cl-b2', emoji: '✈️', author: 'Kai', text: 'Planes and factories emit more in an hour than I save in a year.', likes: '9.6k', comments: '388' },
        { id: 'cl-b3', emoji: '🏛️', author: 'Zoe', text: 'Governments hold the real lever. My lightbulbs will not fix this alone.', likes: '11.2k', comments: '457' },
        { id: 'cl-b4', emoji: '🎨', author: 'Leo', text: '“Eco” labels mean nothing anymore. Greenwashing is everywhere.', likes: '8.4k', comments: '296' },
        { id: 'cl-b5', emoji: '⛏️', author: 'Ivy', text: 'New coal plants are still being approved. In 2026. Really.', likes: '13.7k', comments: '691' },
        { id: 'cl-b6', emoji: '🌊', author: 'Zed', text: 'One country bans plastic bags — the ocean still fills up every year.', likes: '7.1k', comments: '244' },
      ],
    },
  },
  health: {
    emoji: '❤️',
    name: 'Health & Life',
    tagline: 'What keeps people healthy — willpower, or the world around them?',
    sides: {
      A: [
        { id: 'hl-a1', emoji: '😴', author: 'Ava', text: '8 hours of sleep for 30 days. My energy doubled. No joke.', likes: '10.5k', comments: '523' },
        { id: 'hl-a2', emoji: '🚶', author: 'Mia', text: '10,000 steps a day. No gym, no app, just walking.', likes: '4.8k', comments: '118' },
        { id: 'hl-a3', emoji: '🍬', author: 'Sam', text: 'One month without sugar: clearer skin, better mood, more focus.', likes: '6.2k', comments: '209' },
        { id: 'hl-a4', emoji: '🧘', author: 'Lina', text: '10 minutes of meditation a day cut my stress in half.', likes: '7.9k', comments: '267' },
        { id: 'hl-a5', emoji: '🥗', author: 'Theo', text: 'Cooking at home beat every diet app I ever tried.', likes: '3.6k', comments: '84' },
        { id: 'hl-a6', emoji: '☀️', author: 'Nora', text: 'Morning light + 7 minutes of stretching. My focus came back.', likes: '2.9k', comments: '51' },
      ],
      B: [
        { id: 'hl-b1', emoji: '🍔', author: 'Zed', text: 'You cannot out-exercise a food system built around cheap junk.', likes: '9.8k', comments: '374' },
        { id: 'hl-b2', emoji: '⏰', author: 'Kai', text: 'Burnout is not a character flaw. It is a 60-hour work week.', likes: '12.6k', comments: '602' },
        { id: 'hl-b3', emoji: '💰', author: 'Zoe', text: 'Healthy food costs 3× more than fast food. Guess what people on a budget buy.', likes: '11.4k', comments: '489' },
        { id: 'hl-b4', emoji: '🏭', author: 'Rex', text: 'City air hurts everyone. No amount of jogging fixes the smog.', likes: '6.7k', comments: '231' },
        { id: 'hl-b5', emoji: '🏥', author: 'Ivy', text: 'Without access to doctors, no habit in the world can save you.', likes: '8.8k', comments: '305' },
        { id: 'hl-b6', emoji: '👥', author: 'Leo', text: 'Mental health needs people around you — not just an app.', likes: '7.3k', comments: '258' },
      ],
    },
  },
}

// 为每个话题预计算 sideOf 映射（帖子 id → 阵营）
for (const key of Object.keys(TOPICS)) {
  const sideOf = {}
  for (const side of ['A', 'B']) {
    for (const p of TOPICS[key].sides[side]) sideOf[p.id] = side
  }
  TOPICS[key].sideOf = sideOf
}

const clamp = (v) => Math.min(95, Math.max(5, v))

/** 按当前偏向度抽下一条帖子：bias 越高越倾向 A 阵营 */
function pickPost(sides, seen, bias) {
  const prefer = Math.random() * 100 < bias ? 'A' : 'B'
  let candidates = sides[prefer].filter((p) => !seen.has(p.id))
  if (candidates.length === 0) {
    const other = prefer === 'A' ? 'B' : 'A'
    candidates = sides[other].filter((p) => !seen.has(p.id))
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/* ================= 主组件 ================= */

export default function Simulate() {
  const [phase, setPhase] = useState('choose') // choose | feed | think | reveal | bridge
  const [topicKey, setTopicKey] = useState(null)
  const [stats, setStats] = useState(null)
  const [toast, setToast] = useState(null) // 彩蛋俏皮话（提升到主组件，跨阶段存活）

  const startFeed = (key) => {
    setTopicKey(key)
    setPhase('feed')
  }

  const onFeedDone = (s) => {
    setStats(s)
    setPhase('think')
    setTimeout(() => setPhase('reveal'), 1100)
    // 保存结果供模块3总结页使用
    try {
      const mix = s.mix.reduce((acc, side) => ({ ...acc, [side]: (acc[side] ?? 0) + 1 }), {})
      localStorage.setItem(
        'simulate_result',
        JSON.stringify({ topic: s.topicKey, bias: s.bias, mix }),
      )
    } catch {
      /* 忽略 */
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <ProgressBar current="/simulate" />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 md:px-10 md:py-12">
        {phase === 'choose' && <TopicPicker onPick={startFeed} />}
        {phase === 'feed' && (
          <FeedStage
            key={topicKey}
            topic={TOPICS[topicKey]}
            onDone={onFeedDone}
            onEgg={setToast}
          />
        )}
        {phase === 'think' && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <div className="animate-think text-6xl">🧠</div>
            <p className="mt-6 font-display text-3xl font-extrabold text-cocoa">
              The algorithm is learning you…
            </p>
            <p className="mt-2 text-lg text-clay">It only needed 10 taps.</p>
          </div>
        )}
        {phase === 'reveal' && (
          <RevealView
            topic={TOPICS[topicKey]}
            stats={{ ...stats, topicKey }}
            onBridge={() => setPhase('bridge')}
            onRestart={() => {
              setPhase('choose')
              setStats(null)
            }}
          />
        )}

        {phase === 'bridge' && (
          <BridgeView
            onRestart={() => {
              setPhase('choose')
              setStats(null)
            }}
          />
        )}
      </main>

      <Toast text={toast} onClose={() => setToast(null)} />
    </div>
  )
}

/* ================= Step 1：选话题 ================= */

function TopicPicker({ onPick }) {
  return (
    <>
      <div className="text-center">
        <div className="text-base font-bold uppercase tracking-widest text-lagoon">
          Step 1 of 3 · Experience
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-cocoa sm:text-4xl md:text-5xl">
          Pick a topic
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-clay sm:text-xl">
          We'll simulate a feed about it. You just tap like or skip. That's the whole game.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {Object.entries(TOPICS).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => onPick(key)}
            className="flex flex-col items-center rounded-3xl border-2 border-peach bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-lagoon hover:shadow-xl hover:shadow-lagoon/10 sm:p-8"
          >
            <span className="text-5xl sm:text-6xl">{t.emoji}</span>
            <span className="mt-5 font-display text-xl font-extrabold text-cocoa sm:text-2xl">
              {t.name}
            </span>
            <span className="mt-2 text-base leading-relaxed text-clay sm:text-lg">{t.tagline}</span>
            <span className="mt-6 inline-block rounded-full bg-lagoon px-6 py-2.5 text-base font-bold text-white shadow-lg shadow-lagoon/30 sm:px-8 sm:py-3 sm:text-lg">
              Start →
            </span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-base font-semibold text-clay">
        No sign-up · No data leaves your browser · 2 minutes
      </p>
    </>
  )
}

/* ================ 过渡屏：以上仅是示例 ================ */

function BridgeView({ onRestart }) {
  return (
    <div className="flex min-h-[calc(100vh-110px)] flex-col items-center justify-center text-center">
      <div className="animate-bob text-8xl">🫧</div>
      <h1 className="mt-8 max-w-3xl font-display text-3xl font-extrabold leading-tight text-cocoa sm:text-5xl">
        The simulation was just{' '}
        <span className="text-lagoon">one example</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-clay sm:text-2xl">
        以上仅是示例，信息茧房遍布任何你想象不到的地方。
      </p>
      <Link
        to="/info"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-lagoon px-10 py-4 text-xl font-extrabold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60 sm:px-14 sm:py-5 sm:text-2xl"
      >
        Check it out →
      </Link>
      <p className="mt-3 text-base font-semibold text-clay">
        Explore real-world filter bubbles from around the globe
      </p>
      <div className="mt-12 flex gap-6">
        <Link
          to="/act"
          className="rounded-full border-2 border-peach bg-white px-6 py-3 text-base font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-10 sm:py-3.5 sm:text-lg"
        >
          Skip to action tools →
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border-2 border-peach bg-white px-6 py-3 text-base font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-10 sm:py-3.5 sm:text-lg"
        >
          ← Try another topic
        </button>
      </div>
    </div>
  )
}

/* ================= Step 2：信息流 ================= */

function FeedStage({ topic, onDone, onEgg }) {
  const [index, setIndex] = useState(0)
  const [post, setPost] = useState(() => pickPost(topic.sides, new Set(), 50))
  const [leaving, setLeaving] = useState(false)
  const [pop, setPop] = useState(false)

  const bias = useRef(50) // 算法偏向度：50=中立，>50 偏 A，<50 偏 B
  const seen = useRef(new Set())
  const mix = useRef([]) // 每一条已展示帖子的阵营
  const liked = useRef([]) // 点赞过的帖子
  // 彩蛋状态
  const streak = useRef(0) // 连续点赞同一边的次数
  const lastLikedSide = useRef(null)
  const skipCount = useRef(0)
  const egg6Fired = useRef(false)
  const egg7Fired = useRef(false)

  const act = (action) => {
    if (leaving) return
    const side = topic.sideOf[post.id]

    if (action === 'like') {
      liked.current.push(post)
      bias.current = clamp(bias.current + (side === 'A' ? 14 : -14))
      setPop(true)
      // 彩蛋⑥：连续 5 次点赞同一边
      streak.current = lastLikedSide.current === side ? streak.current + 1 : 1
      lastLikedSide.current = side
      if (streak.current >= 5 && !egg6Fired.current) {
        egg6Fired.current = true
        onEgg('5 likes on the same side?! The algorithm has you in a chokehold. 🤣')
      }
    } else {
      // 跳过 = "没兴趣"，算法会轻轻往反方向挪一点
      bias.current = clamp(bias.current - (side === 'A' ? 5 : -5))
      // 彩蛋⑦：一条都没赞
      skipCount.current++
      if (skipCount.current >= FEED_LENGTH && !egg7Fired.current) {
        egg7Fired.current = true
        onEgg('ZERO likes?! Not a single one? (Skipping is also a signal, you know.) 😏')
      }
    }
    mix.current.push(side)

    setLeaving(true)
    setTimeout(() => {
      seen.current.add(post.id)
      const next = index + 1
      setIndex(next)
      if (next >= FEED_LENGTH) {
        onDone({
          topicKey: topic.name,
          bias: bias.current,
          mix: [...mix.current],
          liked: [...liked.current],
          seenIds: [...seen.current],
        })
      } else {
        setPost(pickPost(topic.sides, seen.current, bias.current))
        setLeaving(false)
      }
      setTimeout(() => setPop(false), 450)
    }, 280)
  }

  return (
    <div className="flex min-h-[calc(100vh-110px)] flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-base font-bold uppercase tracking-widest text-lagoon">
          Step 2 of 3 · Experience
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-cocoa sm:text-4xl md:text-5xl">
          Tap what you think
        </h1>
        <p className="mt-2 text-xl text-clay">
          {topic.emoji} {topic.name} · Like it, or skip it. Just react.
        </p>
      </div>

      <div className="mt-8 w-full max-w-[620px]">
        {/* 进度点 */}
        <div className="mb-5 flex justify-center gap-2.5">
          {Array.from({ length: FEED_LENGTH }).map((_, i) => (
            <span
              key={i}
              className={`h-4 rounded-full transition-all duration-300 ${
                i < index ? 'w-4 bg-lagoon/70' : i === index ? 'w-10 bg-lagoon' : 'w-4 bg-peach'
              }`}
            />
          ))}
        </div>

        {/* 帖子卡片 */}
        <div
          key={post.id}
          className={`rounded-3xl border-2 border-peach bg-white p-4 shadow-xl sm:p-7 ${
            leaving ? 'animate-post-out' : 'animate-post-in'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint/20 text-2xl">
              {post.emoji}
            </div>
            <div>
              <div className="text-lg font-bold text-cocoa">{post.author}</div>
              <div className="text-sm text-clay">2h ago</div>
            </div>
          </div>
          <p className="mt-4 text-lg font-semibold leading-relaxed text-cocoa sm:text-xl md:text-2xl">
            {post.text}
          </p>
          <div className="mt-4 text-base font-semibold text-clay">
            ❤️ {post.likes} · 💬 {post.comments}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => act('like')}
            className={`rounded-full bg-lagoon px-8 py-3.5 text-lg font-extrabold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60 sm:px-12 sm:py-4 sm:text-xl ${
              pop ? 'animate-pop' : ''
            }`}
          >
            ❤️ Like
          </button>
          <button
            type="button"
            onClick={() => act('skip')}
            className="rounded-full border-2 border-peach bg-white px-8 py-3.5 text-lg font-extrabold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-12 sm:py-4 sm:text-xl"
          >
            → Skip
          </button>
        </div>
        <p className="mt-3 text-center text-lg font-bold text-clay">
          Post {index + 1} of {FEED_LENGTH}
        </p>
      </div>
    </div>
  )
}

/* ================= Step 3：揭晓对比 ================= */

function RevealView({ topic, stats, onBridge, onRestart }) {
  const { bias, mix, liked } = stats
  const likes = liked.length

  // 点赞倾向统计
  const sideCounts = { A: 0, B: 0 }
  liked.forEach((p) => {
    sideCounts[topic.sideOf[p.id]]++
  })
  const dominant = sideCounts.A >= sideCounts.B ? 'A' : 'B'
  const other = dominant === 'A' ? 'B' : 'A'
  const likeRatio = likes > 0 ? Math.round((sideCounts[dominant] / likes) * 100) : 0

  // 信息流倾斜统计
  const seenSides = { A: 0, B: 0 }
  mix.forEach((s) => {
    seenSides[s]++
  })
  const mixRatio = Math.round((seenSides[dominant] / FEED_LENGTH) * 100)

  // 被算法隐藏的帖子（你不太喜欢的那一边，没机会展示给你的）
  const hiddenPosts = topic.sides[other].filter((p) => !stats.seenIds.includes(p.id))
  // 左右手机显示相同数量的帖子，保证对比视觉均衡
  const n = Math.min(4, likes, hiddenPosts.length)

  return (
    <div className="text-center">
      <div className="text-base font-bold uppercase tracking-widest text-lagoon">
        Step 3 of 3 · Experience
      </div>
      <h1 className="mt-3 font-display text-5xl font-extrabold text-cocoa">
        The bubble built itself
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-xl leading-relaxed text-clay">
        You never chose a side. You just tapped what felt right — and in{' '}
        <span className="font-bold text-cocoa">{FEED_LENGTH} posts</span>, your feed went
        from 50/50 to <span className="font-bold text-lagoon">{mixRatio}%</span> one way.
      </p>

      {/* 手机对比：你看到的 vs 隐藏的 */}
      <div data-testid="phones" className="mt-12 flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-14">
        <div>
          <h3 className="mb-4 font-display text-xl font-extrabold text-mint sm:text-2xl">
            ✓ You saw
          </h3>
          {likes > 0 ? (
            <PhoneMockup title="Your feed" posts={liked.slice(0, n)} variant="visible" />
          ) : (
            <p className="flex min-h-[400px] max-w-[270px] items-center justify-center rounded-3xl border-2 border-peach bg-white p-6 text-lg leading-relaxed text-clay">
              You skipped everything — so the algorithm showed you anything. Silence is
              also a signal to a machine.
            </p>
          )}
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl font-extrabold text-clay sm:text-2xl">
            ✖ Hidden from you
          </h3>
          {hiddenPosts.length > 0 ? (
            <PhoneMockup title="Never shown" posts={hiddenPosts.slice(0, n)} variant="hidden" />
          ) : (
            <p className="flex min-h-[400px] max-w-[270px] items-center justify-center rounded-3xl border-2 border-peach bg-white p-6 text-lg leading-relaxed text-clay">
              You were so balanced that nothing got hidden. Rare — and impressive.
            </p>
          )}
        </div>
      </div>

      {/* 下一站 CTA（跟进 bridge → info → act） */}
      <div className="mt-12 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={onBridge}
          className="inline-block rounded-full bg-lagoon px-10 py-4 text-xl font-extrabold text-white shadow-xl shadow-lagoon/40 transition-all hover:-translate-y-0.5 hover:shadow-lagoon/60 sm:px-14 sm:py-5 sm:text-2xl"
        >
          See what else is hidden →
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border-2 border-peach bg-white px-6 py-3 text-base font-bold text-clay transition-colors hover:border-lagoon hover:text-lagoon sm:px-10 sm:py-3.5 sm:text-lg"
        >
          ← Try another topic
        </button>
      </div>

      {/* 关键数据 */}
      <div data-testid="stats-grid" className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-3">
        <StatCard big={`${likes}/${FEED_LENGTH}`} label="posts you liked" />
        <StatCard big={`${likeRatio}%`} label="of your likes went one way" />
        <StatCard big={`${mixRatio}%`} label="of your feed leaned one way" />
      </div>

      {/* 偏向度仪表 */}
      <div data-testid="bias-meter" className="mx-auto mt-8 max-w-2xl rounded-3xl border-2 border-peach bg-white p-5 sm:p-8">
        <h3 className="font-display text-xl font-extrabold text-cocoa">
          How narrow did your feed get?
        </h3>
        <div className="relative mt-6 h-5 w-full overflow-hidden rounded-full bg-peach">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mint via-lagoon to-lagoon"
            style={{ width: `${bias}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm font-bold text-clay">
          <span>Balanced</span>
          <span>One-sided</span>
        </div>
      </div>

    </div>
  )
}

/** 大数字统计卡 */
function StatCard({ big, label }) {
  return (
    <div className="rounded-3xl border-2 border-peach bg-white p-6">
      <div className="font-display text-3xl font-extrabold text-lagoon sm:text-5xl">{big}</div>
      <div className="mt-2 text-base font-bold text-clay">{label}</div>
    </div>
  )
}
