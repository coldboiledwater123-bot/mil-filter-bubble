/**
 * verify-simulate.mjs —— 用无头 Edge 自动走完模拟器全流程并截图
 * 用法：node scripts/verify-simulate.mjs（需 dev server 运行在 5173）
 * 输出：site/shots/sim-1-choose.png / sim-2-feed.png / sim-3-reveal.png
 */
import puppeteer from 'puppeteer-core'

const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'http://localhost:5173/simulate'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** 按按钮文本点击（兼容无 text: 选择器的版本） */
async function clickByText(page, text) {
  const handles = await page.$$('button')
  for (const h of handles) {
    const txt = await h.evaluate((el) => el.innerText)
    if (txt.includes(text)) {
      await h.click()
      return true
    }
  }
  throw new Error(`未找到按钮: ${text}`)
}

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })

const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console.error: ' + m.text())
})

// 阶段 1：话题选择
await page.goto(URL, { waitUntil: 'load' })
await sleep(1200)
await page.screenshot({ path: 'shots/sim-1-choose.png' })
console.log('✔ 话题选择页已截图')

// 选第一个话题
await clickByText(page, 'Start')
await sleep(800)

// 阶段 2：信息流（like×7 / skip×3，模拟真实用户）
const pattern = ['like', 'like', 'skip', 'like', 'skip', 'like', 'like', 'like', 'skip', 'like']
for (let i = 0; i < pattern.length; i++) {
  await clickByText(page, pattern[i] === 'like' ? 'Like' : 'Skip')
  await sleep(750)
  if (i === 3) {
    await page.screenshot({ path: 'shots/sim-2-feed.png' })
    console.log('✔ 信息流中途已截图（第 4/10 条）')
  }
}

// 阶段 3：思考动画 + 揭晓
await sleep(3000)
await page.screenshot({ path: 'shots/sim-3-reveal.png' })
const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
console.log('✔ 揭晓页已截图，标题:', h1)

// 布局测量：各区块相对视口的位置
const layout = await page.evaluate(() => {
  const rectOf = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: Math.round(r.top), bottom: Math.round(r.bottom) }
  }
  return {
    viewportHeight: window.innerHeight,
    pageHeight: document.body.scrollHeight,
    statsGrid: rectOf('[data-testid="stats-grid"]'),
    biasMeter: rectOf('[data-testid="bias-meter"]'),
    cta: rectOf('main a[href="/act"]'),
    phones: rectOf('[data-testid="phones"]'),
  }
})
console.log('📐 布局测量:', JSON.stringify(layout, null, 2))

console.log(errors.length ? '✘ 捕获到错误:\n' + errors.join('\n') : '✔ 无任何控制台/页面错误')
await browser.close()
