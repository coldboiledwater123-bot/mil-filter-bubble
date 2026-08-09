/**
 * PhoneMockup —— 手机壳 UI 组件
 * 首页双手机对比 & 模拟器信息流都会复用
 * props:
 *   title   顶部栏文字（如 "Your feed"）
 *   posts   帖子数组 [{ emoji, author, text, likes, muted? }]
 *   variant 'visible' | 'hidden' （hidden = 你没看到的，灰化+虚线）
 *   className 额外样式
 */
export default function PhoneMockup({ title, posts = [], variant = 'visible', className = '' }) {
  const isHidden = variant === 'hidden'

  return (
    <div
      className={`w-[230px] rounded-[28px] border-4 bg-white shadow-xl md:w-[270px] ${
        isHidden ? 'border-clay/30' : 'border-lagoon'
      } ${className}`}
    >
      {/* 顶部栏 */}
      <div className="flex items-center justify-between border-b-2 border-peach/70 px-3 py-2">
        <span className="text-xs text-clay">◀</span>
        <span
          className={`text-[10px] font-bold tracking-wide uppercase ${
            isHidden ? 'text-clay/60' : 'text-cocoa'
          }`}
        >
          {title}
        </span>
        <span className="text-xs text-clay">📷</span>
      </div>

      {/* 帖子列表 */}
      <div className="flex flex-col gap-2 p-2.5">
        {posts.map((post, i) => (
          <div
            key={i}
            className={`rounded-2xl p-2.5 ${
              isHidden
                ? 'bg-clay/5 opacity-70 outline-2 outline-dashed outline-clay/40 outline-offset-[-2px] grayscale'
                : 'bg-cream'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isHidden ? 'bg-clay/20' : 'bg-mint/20'
                }`}
              >
                {post.emoji}
              </div>
              <div className="text-[10px] font-bold text-cocoa">{post.author}</div>
            </div>
            <p className="mt-1.5 min-h-[32px] text-[11px] leading-snug text-cocoa/90">
              {post.text}
            </p>
            <div className="mt-1.5 text-[10px] text-clay">
              ❤️ {post.likes} · 💬 {post.comments ?? '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
